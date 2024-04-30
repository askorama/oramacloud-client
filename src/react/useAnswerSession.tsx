import type { AnyDocument, Results, Nullable, SearchParams, AnyOrama } from '@orama/orama'
import type { Message } from '../answerSession.js'
import type { AnswerSessionParams } from '../client.js'

import { useState, useRef, useEffect, useCallback } from 'react'
import { OramaClient } from '../client.js'
import { AnswerSession } from '../answerSession.js'

type AnswerSessionHookClientParams = { oramaClient: OramaClient } | { apiKey: string; endpoint: string }

type AnswerSessionHookParams = AnswerSessionParams & AnswerSessionHookClientParams

export function useAnswerSession<Document = AnyDocument>(params: AnswerSessionHookParams) {
  const [messages, setMessages] = useState<Message[]>(params.initialMessages || [])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<Error>>(null)
  const [aborted, setAborted] = useState<boolean>(false)
  const [sources, setSources] = useState<Nullable<Results<Document>>>(null)
  const sessionRef = useRef<Nullable<AnswerSession>>(null)

  useEffect(() => {
    const oramaClient =
      'oramaClient' in params
        ? params.oramaClient
        : new OramaClient({
            api_key: params.apiKey,
            endpoint: params.endpoint
          })

    sessionRef.current = new AnswerSession({
      ...params,
      initialMessages: params.initialMessages || [],
      inferenceType: params.inferenceType || 'documentation',
      oramaClient: oramaClient,
      events: {
        onMessageChange: (messages) => {
          setMessages(messages)
        },
        onMessageLoading: (receivingMessage) => {
          setLoading(receivingMessage)
        },
        onAnswerAborted: (aborted: true) => {
          setAborted(aborted)
        },
        onSourceChange: (sources) => {
          setSources(sources as unknown as Results<Document>)
        }
      }
    })

    return () => {
      sessionRef.current?.abortAnswer()
    }
  }, [params])

  const ask = useCallback(async (searchParams: SearchParams<AnyOrama>): Promise<void> => {
    if (sessionRef.current) return

    try {
      setAborted(false)
      await sessionRef.current!.ask(searchParams)
    } catch (err) {
      setError(err as unknown as Error)
    }
  }, [])

  const abortAnswer = useCallback(() => {
    sessionRef?.current?.abortAnswer()
  }, [])

  const clearSession = useCallback(() => {
    sessionRef?.current?.clearSession()
  }, [])

  return {
    messages,
    loading,
    aborted,
    abortAnswer,
    error,
    sources,
    ask,
    clearSession
  }
}
