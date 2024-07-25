import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [tableData, setTableData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

// const fetchData = async () => {
//   try {
//     console.log("Attempting connection to the screener");
//
//     const response = await axios.post('http://ec2-65-2-140-54.ap-south-1.compute.amazonaws.com:5000/', {
//       prompt: inputText,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//
//     console.log('Response status:', response.status);
//     console.log('Response headers:', response.headers);
//
//     if (!response.status || response.status >= 400) {
//       console.error('HTTP error!', response.status, response.statusText);
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     const data = response.data;
//     console.log('Data received from server:', data);
//
//     console.log("Connection to screener successful");
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     Alert.alert('Error', 'There was an error fetching data from the server.');
//   }
// };


   const fetchData = async () => {
     try {
       console.log("Attempting connection to the screener");

       const response = await axios.post('http://ec2-65-2-170-165.ap-south-1.compute.amazonaws.com:5000/', {
         prompt: inputText,
       }, {
         headers: {
           'Content-Type': 'application/json',
         },
       });

       console.log('Response status:', response.status);
       console.log('Response headers:', response.headers);

       if (!response.status || response.status >= 400) {
         console.error('HTTP error!', response.status, response.statusText);
         throw new Error(`HTTP error! status: ${response.status}`);
       }

       const data = response.data;
       console.log('Data received from server:', data);

       const columns = Object.keys(data);
       const rows = columns.map(column => Object.values(data[column]));

       setColumnNames(columns);
       setTableData(rows);

       console.log("Connection to screener successful");
     } catch (error) {
       console.error('Error fetching data:', error);
       Alert.alert('Error', 'There was an error fetching data from the server.');
     }
   };


   const [cellWidth, setCellWidth] = useState(0);

    useEffect(() => {
      const { width: screenWidth } = Dimensions.get('window');
      const numColumns = columnNames.length;
      const padding = 20; // Adjust padding as needed
      const calculatedWidth = (screenWidth - padding * 2) / numColumns;
      setCellWidth(calculatedWidth);
    }, [columnNames]); // Recalculate when columnNames change


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter input"
        value={inputText}
        onChangeText={handleInputChange}
      />

      <TouchableOpacity style={styles.button} onPress={fetchData}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

      <ScrollView horizontal>
            {tableData.length > 0 && (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeaderRow}>
                  {columnNames.map((columnName, index) => (
                    <Text key={index} style={[styles.headerCell, { width: cellWidth }]}>
                      {columnName}
                    </Text>
                  ))}
                </View>

                <ScrollView nestedScrollEnabled>
                  {tableData[0]?.map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                      {tableData.map((column, columnIndex) => (
                        <Text key={columnIndex} style={[styles.tableCell, { width: cellWidth }]}>
                          {column[rowIndex]}
                        </Text>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
          </View>
        );
      };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderRadius: 11,
    borderWidth: 1,
    padding: 10,
    marginTop: 25,
    marginBottom: 10,
  },
  // Button Styling
  button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      width: '30%',
      alignItems: 'center',
    },
   buttonText: {
       color: '#fff',
       fontSize: 20,
     },
  // Table Styling
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    borderWidth: 1, // Add cell borders
    borderColor: '#ccc',
  },
});

export default App;