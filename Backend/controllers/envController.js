const fs = require('fs');
const path = require('path');

const updateMongoCredentials = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const newMongoUri = `mongodb+srv://${username}:${password}@atlascluster.swfkjzc.mongodb.net/`;
  const envPath = path.join(__dirname, '../.env');

  try {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    envContent = envContent.replace(/^MONGO_URI=.*$/m, `MONGO_URI=${newMongoUri}`);
    fs.writeFileSync(envPath, envContent);

    res.status(200).json({ message: '✅ Mongo credentials updated. Please restart the server.' });
  } catch (err) {
    console.error('Error updating .env file:', err);
    res.status(500).json({ error: 'Failed to update .env file' });
  }
};

module.exports = {
  updateMongoCredentials,
};
