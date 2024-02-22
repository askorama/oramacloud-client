import { OramaClient } from '../src/index.js'
import t from 'node:test'
import Fastify from 'fastify'
import fFormBody from '@fastify/formbody'
import { AddressInfo } from 'node:net'
import { once, EventEmitter } from 'node:events'
import assert from 'node:assert'

await t.test('client', async t => {
  const {
    port,
    telementryWaiter
  } = await setUpServer(t)

  const endpoint = `http://localhost:${port}/index/my-index`
  const apiKey = 'my-api-key'

  await t.test('search should return the result', async t => {
    const client = new OramaClient({
      endpoint,
      api_key: apiKey
    })

    const results = await client.search({
      mode: 'fulltext',
      term: 'foobar'
    })

    assert.equal(55, results.count)
    assert.equal(0, results.hits.length)

    const telemetryBody = await once(telementryWaiter, 'telemetry')

    assert.equal(1, telemetryBody.length)
    assert.equal(telemetryBody[0].events[0].rawSearchString, 'foobar')
  })

  await t.test('vectorSearch should return the result', async t => {
    const client = new OramaClient({
      endpoint,
      api_key: apiKey
    })

    const results = await client.vectorSearch({
      mode: 'fulltext',
      term: 'foobar',
    })

    assert.equal(0, results.hits.length)

    const telemetryBody = await once(telementryWaiter, 'telemetry')

    assert.equal(1, telemetryBody.length)
    assert.equal(telemetryBody[0].events[0].rawSearchString, 'foobar')
  })
})

async function setUpServer (t: any): Promise<{
  port: number
  telementryWaiter: EventEmitter
}> {
  const fastify = Fastify()
  const telementryWaiter = new EventEmitter()

  await fastify.register(fFormBody)
  fastify.get('/index/my-index/init', async (request, reply) => {
    return {
      collectUrl: `http://localhost:${port}/collect`,
      deploymentID: 'the-deployment-id',
      index: 'my-index'
    }
  })
  fastify.post('/index/my-index/search', async (request, reply) => {
    return {
      hits: [],
      count: 55
    }
  })

  fastify.post('/index/my-index/vector-search2', async (request, reply) => {
    return {
      hits: [],
      count: 55
    }
  })
  fastify.post('/collect', async (request, reply) => {
    telementryWaiter.emit('telemetry', request.body)
    return {
      hits: [],
      count: 55
    }
  })
  await fastify.listen()
  t.after(async () => await fastify.close())
  const port = (fastify.server.address() as AddressInfo).port

  return {
    port,
    telementryWaiter
  }
}
