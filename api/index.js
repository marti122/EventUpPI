import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import config from './config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
const port = 3000
const jwtSecret = 'tajnaLozinka123'

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

// Middleware za zaštitu ruta
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

// API LOGIN - sada šalje i username uz token i role
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password, role } = req.body

    const result = await query('SELECT * FROM users WHERE username = ?', [username])

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime.' })
    }

    const user = result[0]

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Pogrešna lozinka.' })
    }

    if (user.role !== role) {
      return res.status(403).json({ success: false, message: 'Neispravna uloga.' })
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, {
      expiresIn: '1h',
    })

    // ➡️ Sad vraćamo i username uz token
    res.json({
      success: true,
      role: user.role,
      token,
      username: user.username,
    })
  } catch (err) {
    console.error('Greška u loginu:', err.message)
    next(err)
  }
})

// ZAŠTIĆENE RUTE (s verifyToken)

app.get('/api/organizator', verifyToken, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM organizator')
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.put('/api/organizator/:sifra_organizatora', verifyToken, async (req, res, next) => {
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

app.post('/api/organizator', verifyToken, async (req, res, next) => {
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

app.delete('/api/organizator/:sifra_organizatora', verifyToken, async (req, res, next) => {
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

app.get('/api/izvodac', verifyToken, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM izvodac')
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.put('/api/izvodac/:sifra_izvodaca', verifyToken, async (req, res, next) => {
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

app.post('/api/izvodac', verifyToken, async (req, res, next) => {
  try {
    const {
      sifra_izvodaca,
      ime_izvodaca,
      prezime_izvodaca,
      umjetnickoIme_izvodaca,
      kontakt_izvodaca,
    } = req.body

    await query(
      'INSERT INTO izvodac (sifra_izvodaca, ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca) VALUES (?, ?, ?, ?, ?)',
      [sifra_izvodaca, ime_izvodaca, prezime_izvodaca, umjetnickoIme_izvodaca, kontakt_izvodaca],
    )

    const noviIzvodaci = await query('SELECT * FROM izvodac')
    res.json({ message: 'Izvođač dodan', izvodaci: noviIzvodaci })
  } catch (err) {
    console.error('Greška u ubacivanju:', err.message)
    next(err)
  }
})

app.delete('/api/izvodac/:sifra_izvodaca', verifyToken, async (req, res, next) => {
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

app.get('/api/nastupi', verifyToken, async (req, res, next) => {
  try {
    const result = await query('SELECT datum_nastupa, mjesto_nastupa, sifra_izvodaca FROM nastup')
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.post('/api/nastupi', verifyToken, async (req, res, next) => {
  try {
    const { datum_nastupa, mjesto_nastupa, sifra_izvodaca } = req.body

    const izvodac = await query('SELECT * FROM izvodac WHERE sifra_izvodaca = ?', [sifra_izvodaca])
    if (izvodac.length === 0) {
      return res.status(400).json({ error: 'Izvođač nije pronađen.' })
    }

    await query(
      'INSERT INTO nastup (datum_nastupa, mjesto_nastupa, sifra_izvodaca) VALUES (?, ?, ?)',
      [datum_nastupa, mjesto_nastupa, sifra_izvodaca],
    )

    res.json({ message: 'Nastup dodan' })
  } catch (err) {
    console.error('Greška pri spremanju nastupa:', err.message)
    next(err)
  }
})

// Update korisničkih podataka
app.put('/api/user/update', verifyToken, async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const userId = req.user.id

    let sql = 'UPDATE users SET '
    const fields = []
    const params = []

    if (username) {
      fields.push('username = ?')
      params.push(username)
    }
    if (email) {
      fields.push('email = ?')
      params.push(email)
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      fields.push('password = ?')
      params.push(hashedPassword)
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nema podataka za ažurirati.' })
    }

    sql += fields.join(', ') + ' WHERE id = ?'
    params.push(userId)

    await query(sql, params)

    res.json({ message: 'Korisnički podaci uspješno ažurirani.' })
  } catch (err) {
    console.error('Greška u ažuriranju korisnika:', err.message)
    next(err)
  }
})

// Pokreni server
app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`)
})
