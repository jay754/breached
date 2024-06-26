import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  StyleSheet 
} from 'react-native';

const App = () => {
  const [email, setEmail] = useState('');
  const [breaches, setBreaches] = useState([]);
  const [error, setError] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);

  const searchEmail = async () => {
    setError('');
    setHasResults(false);
    setHasNoResults(false);
    setBreaches([]);

    if (!email.trim()) {
        alert('Please enter a valid breach email.');
        return;
    }

    try {
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
        method: 'GET',
        headers: {
          'hibp-api-key': ''
        }
      });

      // Check the status to handle a 404 or no content response properly
      if (response.status === 404) {
        setHasNoResults(true);
        setTimeout(() => {
          setHasNoResults(false); // Hide the message after 3000 milliseconds (3 seconds)
        }, 5000);
        return;
      }

      if (!response.ok) {
        setError('Failed to fetch data');
        return;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setBreaches(data);
        setHasResults(true);
      } else {
        setHasNoResults(true);
        setTimeout(() => {
          setHasNoResults(false); // Hide the message after 3000 milliseconds (3 seconds)
        }, 5000);
      }
    } catch (err) {
      setError('Error searching the email');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.mini_container}> 
        <Text style={styles.header}> Breached? </Text>

        <Text style={styles.header_sku}> Check if your email address is in a data breach </Text>

        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter email address"
          keyboardType="email-address"
        />

        <Button style={styles.button} title="Search" onPress={searchEmail} />

        {hasNoResults && (
          <Text style={styles.success}>No breaches found. Your email appears to be safe!</Text>
        )}

        {hasResults && (
          <Text style={styles.warning}>Oh no — your email has been breached {breaches.length} times </Text>
        )}
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'steelblue',
  },
  mini_container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    backgroundColor: 'white',
    padding: 20
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    width: '100%',
  },
  header: {
    fontSize: 60,
    marginTop: 20,
  },
  warning: {
    backgroundColor: 'red',
    color: 'white',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  success: {
    backgroundColor: 'green',
    color: 'white',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default App;