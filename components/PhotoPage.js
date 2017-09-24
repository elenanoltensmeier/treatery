import React, {Component} from 'react';
import ReactNative from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as firebase from 'firebase';
import Camera from 'react-native-camera';
import { Icon } from 'react-native-elements';
import StatusBar from './StatusBar';
import styles from '../styles';
const {
  Text,
  View,
  KeyboardAvoidingView,
  TouchableHighlight
} = ReactNative;

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.storeRef = this.getRef().child('photos');
  }
  getRef() {
    return firebase.database().ref();
  }
}
module.exports = PhotoPage;