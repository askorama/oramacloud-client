import t from 'node:test'
import assert from 'node:assert'
import { OramaProxy } from '../src/proxy.js'
import 'dotenv/config.js'

const client = new OramaProxy({
  api_key: process.env.ORAMA_SECURE_PROXY_API_KEY_TEST || ''
})

await t.test('secure proxy', async t => {
  await t.test('can generate openai embeddings', async t => {
    const embeddings = await client.generateEmbeddings('hello world', 'openai/text-embedding-ada-002')
    assert.equal(embeddings.length, 1536)
  })

  await t.test('can generate chat responses via gpt-3.5-turbo', async t => {
    const resp = await client.chat({
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    assert.ok(resp.length > 0)
  })

  await t.test('can generate chat responses via gpt-3.5-turbo-16k', async t => {
    const resp = await client.chat({
      model: 'openai/gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    assert.ok(resp.length > 0)
  })

  await t.test('can generate chat responses via gpt-4', async t => {
    const resp = await client.chat({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    assert.ok(resp.length > 0)
  })

  await t.test('can generate chat responses via gpt-4-1106-preview', async t => {
    const resp = await client.chat({
      model: 'openai/gpt-4-1106-preview',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    assert.ok(resp.length > 0)
  })

  await t.test('can stream chat responses via gpt-3.5-turbo', async t => {
    const resp = client.chatStream({
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    for await (const message of resp) {
      assert.ok(message.length > 0)
    }
  })

  await t.test('can stream chat responses via gpt-3.5-turbo-16k', async t => {
    const resp = client.chatStream({
      model: 'openai/gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    for await (const message of resp) {
      assert.ok(message.length > 0)
    }
  })

  await t.test('can stream chat responses via gpt-4', async t => {
    const resp = client.chatStream({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    for await (const message of resp) {
      assert.ok(message.length > 0)
    }
  })

  await t.test('can stream chat responses via gpt-4-1106-preview', async t => {
    const resp = client.chatStream({
      model: 'openai/gpt-4-1106-preview',
      messages: [{ role: 'user', content: 'Who is Michael Scott?' }]
    })

    for await (const message of resp) {
      assert.ok(message.length > 0)
    }
  })

})