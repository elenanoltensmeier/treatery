import React, {Component} from 'react';
import ReactNative from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as firebase from 'firebase';
import Camera from 'react-native-camera';
import { Icon } from 'react-native-elements';
import StatusBar from './StatusBar';
import styles from '../styles';
const {
  Alert,
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableHighlight
} = ReactNative;

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      barcode: null,
      barcodeType: null
    };
    this.fireRef = firebase.storage().ref('photos');
  }
  uploadPhoto() {
    let pathArray = this.state.path.split('/');
    let firename = '/'+pathArray[pathArray.length-1];

    var uploadTask = this.fireRef.child(firename).put(this.state.path);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      // observe state change events such as progress
      // get task progress, including the number of bytes uploaded and the total number of    bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    
      switch (snapshot.state) {
        case firebase.storage.TaskState.SUCCESS: // or 'success'
          console.log('Upload is complete');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default:
          console.log(snapshot.state);
      }
    }, (error) => {
      console.error(error);
    }, () => {
      const uploadTaskSnapshot = uploadTask.snapshot;
      // task finished
      // states: https://github.com/invertase/react-native-firebase/blob/master/lib/modules/storage/index.js#L139
      console.log(uploadTaskSnapshot.state === firebase.storage.TaskState.SUCCESS);
      console.log(uploadTaskSnapshot.bytesTransferred === uploadTaskSnapshot.totalBytes);
      console.log(uploadTaskSnapshot.metadata);
      console.log(uploadTaskSnapshot.downloadUrl)
    });
  }
  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.setState({ path: data.path });
      })
      .catch(err => console.error(err));
  }
  renderCamera(){
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        captureTarget={Camera.constants.CaptureTarget.disk}
        onBarCodeRead={this._onBarCodeRead.bind(this)}
      >
        <Icon 
          name='camera-iris'
          type='material-community'
          color='#333333'
          style={styles.capture}
          onPress={this.takePicture.bind(this)}/>
      </Camera>
    );
  }
  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <View style={styles.photoButtons}>
          <Icon 
              name='cloud-upload'
              type='material-community'
              color='#333333'
              style={styles.photoButton}
              onPress={this.uploadPhoto.bind(this)}/>
          <Icon 
              name='cancel'
              type='material-community'
              color='#333333'
              style={styles.photoButton}
              onPress={() => this.setState({ path: null })}/>
        </View>
      </View>
    );
  }
  _onBarCodeRead(e) {
    this.setState({ barcode: e.data, barcodeType: e.type });
  }
  renderBarCodeInfo() {
    return (
      <View>
        <Text>Barcode Found!</Text>
        <Text>{this.state.barcode}</Text>
        <Text>{this.state.barcodeType}</Text>
        <Icon 
              name='cancel'
              type='material-community'
              color='#333333'
              style={styles.photoButton}
              onPress={() => this.setState({ barcode: null, barcodeType: null })}/>
      </View>
    )
  }
  selectPage(){
    if(this.state.path){
      return this.renderImage();
    }else if(this.state.barcode){
      return this.renderBarCodeInfo();
    }else{
      return this.renderCamera();
    }
  }  
  render() {
    return (
      <View style={styles.panelContrainer}>
        {this.selectPage()}
      </View>
    )
  }
}
module.exports = CameraPage;