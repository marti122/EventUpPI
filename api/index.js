import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import config from './config.js' // dodaj ekstenziju .js!

const app = express()
const port = 3000

// Funkcija za izvršavanje SQL upita
async function query(sql, params = []) {
  try {
    const connection = await mysql.createConnection(config.db)
    const [results] = await connection.execute(sql, params)
    await connection.end()
    return results
  } catch (error) {
    console.error('Greška u izvršavanju upita:', error.message)
    throw error
  }
}

// Middleware
app.use(express.json())
app.use(cors({ origin: '*' }))

// GET - Dohvati sve organizatore
app.get('/api/organizator', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM organizator')
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// PUT - Ažuriraj organizatora
app.put('/api/organizator/:sifra_organizatora', async (req, res, next) => {
  try {
    const { sifra_organizatora } = req.params
    const { naziv_organizatora, kontakt_organizatora, lokacija_organizatora } = req.body

    const result = await query(
      'UPDATE organizator SET naziv_organizatora = ?, kontakt_organizatora = ?, lokacija_organizatora = ? WHERE sifra_organizatora = ?',
      [naziv_organizatora, kontakt_organizatora, lokacija_organizatora, sifra_organizatora],
    )

    res.json({ message: 'Organizator ažuriran', result })
  } catch (err) {
    console.error('Greška u ažuriranju:', err.message)
    next(err)
  }
})

// POST - Dodaj novog organizatora
app.post('/api/organizator', async (req, res, next) => {
  try {
    const { sifra_organizatora, naziv_organizatora, kontakt_organizatora, lokacija_organizatora } =
      req.body

    await query(
      'INSERT INTO organizator (sifra_organizatora, naziv_organizatora, kontakt_organizatora, lokacija_organizatora) VALUES (?, ?, ?, ?)',
      [sifra_organizatora, naziv_organizatora, kontakt_organizatora, lokacija_organizatora],
    )

    const noviOrganizatori = await query('SELECT * FROM organizator')
    res.json({ message: 'Organizator dodan', organizatori: noviOrganizatori })
  } catch (err) {
    console.error('Greška u ubacivanju:', err.message)
    next(err)
  }
})

// DELETE - Obriši organizatora
app.delete('/api/organizator/:sifra_organizatora', async (req, res, next) => {
  try {
    const { sifra_organizatora } = req.params

    const result = await query('DELETE FROM organizator WHERE sifra_organizatora = ?', [
      sifra_organizatora,
    ])

    if (result.affectedRows > 0) {
      res.json({ message: 'Organizator obrisan' })
    } else {
      res.status(404).json({ error: 'Organizator nije pronađen' })
    }
  } catch (err) {
    console.error('Greška u brisanju:', err.message)
    next(err)
  }
})
// GET - Dohvati sve izvođače
app.get('/api/izvodac', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM izvodac')
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// PUT - Ažuriraj izvođača
app.put('/api/izvodac/:sifra_izvodaca', async (req, res, next) => {
  try {
    const { sifra_izvodaca } = req.params
    const { ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca } = req.body

    const result = await query(
      'UPDATE izvodac SET ime_izvodaca = ?, prezime_izvodaca = ?, umjetnickoIme_izvodaca = ?, kontakt_izvodaca = ? WHERE sifra_izvodaca = ?',
      [ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca, sifra_izvodaca],
    )

    res.json({ message: 'Izvođač ažuriran', result })
  } catch (err) {
    console.error('Greška u ažuriranju:', err.message)
    next(err)
  }
})

// POST - Dodaj novog izvođača
app.post('/api/izvodac', async (req, res, next) => {
  try {
    const { ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca } = req.body

    await query(
      'INSERT INTO izvodac (ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca) VALUES (?, ?, ?, ?, ?)',
      [ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca],
    )

    const noviIzvodaci = await query('SELECT * FROM izvodac')
    res.json({ message: 'Izvođač dodan', izvodaci: noviIzvodaci })
  } catch (err) {
    console.error('Greška u ubacivanju:', err.message)
    next(err)
  }
})

// DELETE - Obriši izvođača
app.delete('/api/izvodac/:sifra_izvodaca', async (req, res, next) => {
  try {
    const { sifra_izvodaca } = req.params

    const result = await query('DELETE FROM izvodac WHERE sifra_izvodaca = ?', [sifra_izvodaca])

    if (result.affectedRows > 0) {
      res.json({ message: 'Izvođač obrisan' })
    } else {
      res.status(404).json({ error: 'Izvođač nije pronađen' })
    }
  } catch (err) {
    console.error('Greška u brisanju:', err.message)
    next(err)
  }
})
// GET - Dohvati sva događanja (nastupe)
app.get('/api/nastupi', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT datum_nastupa, mjesto_nastupa, sifra_izvodaca
      FROM nastup
    `)
    res.json(result)
  } catch (err) {
    next(err)
  }
})
// GET - Dohvati detalje izvođača prema šifri
app.get('/api/izvodac/:sifra_izvodaca', async (req, res, next) => {
  try {
    const { sifra_izvodaca } = req.params
    const result = await query(
      `
      SELECT ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca
      FROM izvodac
      WHERE sifra_izvodaca = ?
    `,
      [sifra_izvodaca],
    )

    if (result.length > 0) {
      res.json(result[0])
    } else {
      res.status(404).json({ error: 'Izvođač nije pronađen' })
    }
  } catch (err) {
    next(err)
  }
})
// POST - Dodaj novi nastup
app.post('/api/nastupi', async (req, res, next) => {
  try {
    const { datum_nastupa, mjesto_nastupa, sifra_izvodaca } = req.body

    await query(
      'INSERT INTO nastup (datum_nastupa, mjesto_nastupa, sifra_izvodaca) VALUES (?, ?, ?)',
      [datum_nastupa, mjesto_nastupa, sifra_izvodaca],
    )

    const noviNastupi = await query('SELECT * FROM nastup')
    res.json({ message: 'Nastup dodan', nastupi: noviNastupi })
  } catch (err) {
    console.error('Greška u ubacivanju nastupa:', err.message)
    next(err)
  }
})
// GET - Dohvati sve izvođače (samo ime i prezime)
app.get('/api/izvodac', async (req, res, next) => {
  try {
    const result = await query('SELECT sifra_izvodaca, ime_izvodaca, prezime_izvodaca FROM izvodac')
    res.json(result)
  } catch (err) {
    next(err)
  }
})
// Pokreni server
app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`)
})
