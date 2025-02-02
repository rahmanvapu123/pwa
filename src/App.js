import React, { useEffect, useState } from 'react';
import logo from './assets/smiley.gif';
import './App.css';

function App() {
  const [sampledata, setSampledata] = useState([]);
  const [input, setInput] = useState('');
  let newArray = [];
  useEffect(() => {
    async function getData() {
      try {
        addDataToApi()
      } catch (e) {
        console.log('Error fetching data:', e);
      } finally {
        fetch('https://jsonplaceholder.typicode.com/users')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(json => {
            json.map((item) => newArray.push(item))

          })
          .then(() => {
            setSampledata(newArray)
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
    }
    async function addDataToApi() {
      fetchDataLocalDB().then(data => {
        if (data) {
          data.map((item) => {
            fetch('https://jsonplaceholder.typicode.com/users', {
              method: 'POST',
              body: JSON.stringify({
                name: item.name,
                body: 'bar',
                userId: 1,
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((response) => response.json())
              .then((json) => {
                console.log(json)
                newArray.push(json);
              });
          })
        }
      });
    }
    async function offlineData() {

      // Usage Example
      fetchDataLocalDB().then(data => {
        setSampledata(data)
      }).catch(error => {
        console.error("Error:", error);
      });


    }
    if (navigator.onLine) {
      getData();
    } else {
      offlineData();
    }
  }, []);
  function fetchDataLocalDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offlineDB', 1);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineStore', 'readonly');
        const store = transaction.objectStore('offlineStore');

        const getRequest = store.get('offlineData');

        getRequest.onsuccess = () => {
          let existingData = getRequest.result ? getRequest.result.data : [];
          resolve(existingData); // Resolve the Promise with the data
        };

        getRequest.onerror = () => {
          reject('Error fetching data from IndexedDB');
        };
      };

      request.onerror = () => {
        reject('Error opening IndexedDB');
      };
    });
  }



  function addDataToLocalDB(input) {
    const request = indexedDB.open('offlineDB', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('offlineStore', 'readwrite');
      const store = transaction.objectStore('offlineStore');

      // Get the existing array
      const getRequest = store.get('offlineData');

      getRequest.onsuccess = () => {
        let existingData = getRequest.result ? getRequest.result.data : [];
        existingData.push({ name: input }); // Add new item to array
        setSampledata(existingData);
        // Update IndexedDB
        store.put({ id: 'offlineData', data: existingData });

      };
    };
  }
  const addData = (input) => {
    if (navigator.onLine) {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          name: input,
          body: 'bar',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setSampledata([...sampledata, json]);
          //console.log([...sampledata, json])
        });
    } else {
      addDataToLocalDB(input);

    }
  }
  return (
    <div className="App">
      <div><input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='enter name' />
        <button onClick={() => addData(input)} >add</button></div>
      {sampledata.map((item, index) => (
        <div key={index} >
          <h5>{item.name}</h5>
        </div>
      ))}
    </div>
  );
}

export default App;
