import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS, {ReadDirItem} from 'react-native-fs';

const App = () => {
  const [currentPath, setCurrentPath] = useState(RNFS.DownloadDirectoryPath);
  const [folders, setFolders] = useState<ReadDirItem[]>([]);

  const getAllFolders = useCallback(() => {
    RNFS.readDir(currentPath)
      .then(result => {
        setFolders(result);
        console.log('GOT RESULT', result);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  }, [currentPath]);

  const requestStoragePermission = useCallback(async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const readGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const writeGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      console.log(readGranted, writeGranted);

      if (!readGranted || !writeGranted) {
        console.log('Read and write permissions have not been granted');
        return;
      }
      getAllFolders();
      console.log('Read and write permissions have been granted');
    } catch (err) {
      console.warn(err);
    }
  }, [getAllFolders]);

  useEffect(() => {
    (async () => await requestStoragePermission())();
  }, [requestStoragePermission]);

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        renderItem={({item, index}) => (
          <TouchableOpacity>
            <Text style={{color: 'black'}}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
