const { generateRegistrationOptions } = require('@simplewebauthn/server');
const crypto = require('crypto');

const challengeStore = {}; // You may want to replace this with a DB or session store in production

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}



const Passkey = async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ error: 'userId and userName are required' });
    }

    const userIDBuffer = Buffer.from(userId, 'utf8');

    const challengePayload = await generateRegistrationOptions({
        // rpID: 'localhost',
        rpID: 'horizon-8xtw.vercel.app',
        rpName: 'Horizon',
        attestationType: 'none',
        userName: userName,
        timeout: 30_000,
        authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred',
  },
    })

    // Store challenge for future verification
     challengeStore[userId] = challengePayload.challenge
     return res.status(200).json({ options: challengePayload });
  } catch (err) {
    console.error('Error generating registration options:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = Passkey;
