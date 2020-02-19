import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

class ShowWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <WebView source={props.url} style={{flex: 1}} />
      </View>
    );
  }
}

export default ShowWebView;
