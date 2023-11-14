import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

import { execSync } from 'node:child_process'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 5000, type: 'credit' })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    // Prepare
    const sample1 = { title: 'New Transaction1', amount: 4000, type: 'credit' }

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ ...sample1 })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const sample2 = { title: 'New Transaction2', amount: 2000, type: 'debit' }
    await request(app.server)
      .post('/transactions')
      .send({ ...sample2 })
      .set('Cookie', cookies)

    // Act
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // Assert
    expect(listTransactionResponse.body.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: sample1.title,
          amount: sample1.amount,
        }),
        expect.objectContaining({
          title: sample2.title,
          amount: sample2.amount * -1,
        }),
      ]),
    )
  })

  it('should be able to get a specific transaction', async () => {
    // Prepare
    const sample = { title: 'New Transaction1', amount: 4000, type: 'credit' }

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ ...sample })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // Act
    const transaction = await request(app.server)
      .get(`/transactions/${listTransactionResponse.body.transactions[0].id}`)
      .set('Cookie', cookies)

    // Assert
    expect(transaction.body.transaction).toEqual(
      expect.objectContaining({ title: sample.title, amount: sample.amount }),
    )
  })

  it('should be able to get a transaction amount summary', async () => {
    // Prepare
    const sample1 = {
      title: 'Credit Transaction',
      amount: 4000,
      type: 'credit',
    }

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ ...sample1 })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const sample2 = { title: 'Debit Transaction', amount: 2000, type: 'debit' }
    await request(app.server)
      .post('/transactions')
      .send({ ...sample2 })
      .set('Cookie', cookies)

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)
    // Act

    // Assert
    expect(summaryResponse.body.summary.amount).toBe(
      sample1.amount + sample2.amount * -1,
    )
  })
})
