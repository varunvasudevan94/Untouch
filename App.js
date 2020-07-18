/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View,
  PermissionsAndroid
} from 'react-native';

import wifi from 'react-native-android-wifi';

const calculateApproxDistance = (signalLevelInDbM,freqInKHz) => {
  // XXX - Todo ask someone better with domain expertise. 
  // This function is absolutely an approximate do not take it literally
  // Catch hold of an electronics intern to do some ML and come up with a better equation.
  const exp = (20.55 - (20 * Math.log10(freqInKHz)) + Math.abs(signalLevelInDbM)) / 20.0;
  return Math.pow(10.0, exp); // in meters
 }

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isWifiNetworkEnabled: null,
      ssid: null,
      pass: null,
      ssidExist: null,
      currentSSID: null,
      currentBSSID: null, 
      wifiList: null,
      modalVisible: false,
      status:null,
      level: null,
      ip: null,
    };

  }

  componentDidMount (){
    console.log(wifi);
    this.askForUserPermissions();
  }

  async askForUserPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  getWifiNetworksOnPress(){
    wifi.loadWifiList((wifiStringList) => {
        console.log(wifiStringList);
        var wifiArray = JSON.parse(wifiStringList);
        this.setState({
          wifiList:wifiArray,
          modalVisible: true
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  renderWifiList(){
    var wifiListComponents = [];
    for (w in this.state.wifiList){
      wifiListComponents.push(
        <View key={w} style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>{this.state.wifiList[w].SSID}</Text>
          <Text>BSSID: {this.state.wifiList[w].BSSID}</Text>
          <Text>Frequency: {this.state.wifiList[w].frequency}</Text>
          <Text>Level: {this.state.wifiList[w].level}</Text>
          <Text>Distance: {calculateApproxDistance(this.state.wifiList[w].level, this.state.wifiList[w].frequency)} </Text>
        </View>
      );
    }
    return wifiListComponents;
  }

  render() {
    return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get all wifi networks in range</Text>
          <TouchableHighlight style={styles.bigButton} onPress={this.getWifiNetworksOnPress.bind(this)}>
            <Text style={styles.buttonText}>Available WIFI Networks</Text>
          </TouchableHighlight>
        </View>
        {this.renderWifiList()}
      </View>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    backgroundColor: '#F5FCFF',
    marginBottom:100
  },
  row:{
    flexDirection:'row'
  },
  title: {
    fontSize: 20,
  },
  instructionsContainer: {
    padding:15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  instructionsTitle: {
    marginBottom:10,
    color: '#333333'
  },
  instructions: {
    color: '#333333'
  },
  button:{
    padding:5,
    width:120,
    alignItems: 'center',
    backgroundColor:'blue',
    marginRight: 15,
  },
  bigButton:{
    padding:5,
    width:180,
    alignItems: 'center',
    backgroundColor:'blue',
    marginRight: 15,
  },
  buttonText:{
    color:'white'
  },
  answer:{
    marginTop: 5,
  }
});