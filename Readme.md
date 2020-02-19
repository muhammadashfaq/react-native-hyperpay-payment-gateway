# React Native Advance Concepts

[![N|Solid](https://user-images.githubusercontent.com/48868012/74805141-137aa200-5304-11ea-8de1-6dae846c70f3.jpg)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

React Native is a javascript framework that helps to make apps for both platforms with single code base.
Purpopse of this concepts collection is to reuse the code in future

  - Learn Once,Write Anywhere

# HyperPay Payment Gateway!
The Open Payment Platform is a single unified RESTful API allowing access to the complete set of the Open Payment Platform features and frontend widgets.
Reasone to add this concept into collection is that their is no library present for react native support. So HyperPay Teams helped us to write the native modules for react native support.

### Build configuration on iOS

Download iOS SDK from https://drive.google.com/open?id=1YqxM4uGp2jApbqROOjBEkAr2UhKEDtkp

#### Using CocoaPods (React Native 0.60 and higher)
  - Drag & Drop iOS SDK files into your ios folder
  - and open the produced workspace file (.xcworkspace) in XCode to build your project.
  - Edit URL Types in Xcode like below
  - [![N|Solid](https://user-images.githubusercontent.com/48868012/74806059-bb916a80-5306-11ea-917f-09497f07a217.png)](https://nodesource.com/products/nsolid)
  - In URL Schema, Replace package name with your package name like this
  - com.your.application.payments
  - Open Build Phases -> Link Binary With Libararies -> add OOPwamobile.framework.
  - [![N|Solid](https://user-images.githubusercontent.com/48868012/74806324-80dc0200-5307-11ea-907a-9023fcaf388a.png)](https://nodesource.com/products/nsolid)
  - Open Builde Phases -> Copy Bundle Resources -> Add OppwMobile-Resouces.bundle
  - [![N|Solid](https://user-images.githubusercontent.com/48868012/74806499-f21bb500-5307-11ea-80d8-7013ccc96ed7.png)](https://nodesource.com/products/nsolid)
  - Open AppDelegate.m and paste the following code before end
```
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

[![N|Solid](https://user-images.githubusercontent.com/48868012/74806815-c8af5900-5308-11ea-82e3-225faab39b34.png)](https://nodesource.com/products/nsolid)


That's it. your made it.


### Build Configration on Android
  - Download android SDK from https://drive.google.com/open?id=1YqxM4uGp2jApbqROOjBEkAr2UhKEDtkp
  - Drap and drop android folder files into android folder
  - Place ```HyperPayModule.java``` and ```HyperpayPakcage.java``` in ```android -> app -> main -> com.app. -> java ->```
  - Open ```setting.gradle``` and add include ':app', ':oppwa.mobile-2.44.0' at the end of file
  - Open ```android -> app -> main -> com.app. -> java -> HyperPayModule.java```
  - replace package name with your package name
  - Same above steps for ```HyperModulePackage.java```
  - Open ```AndroidManifest.xml``` and Place below code in ```<activity> .MainActivity ```
```
<intent-filter android:label="@string/app_name">
    <action android:name="android.intent.action.VIEW" />
     <category android:name="android.intent.category.DEFAULT" />
     <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="hyperpay" android:host="result" />
</intent-filter>
```
 [![N|Solid](https://user-images.githubusercontent.com/48868012/74808213-2db87e00-530c-11ea-81f8-4ee3b76fb651.png)](https://nodesource.com/products/nsolid)
 
 
 That's it, You made it :)
 
 
 #### Usage

App.js
```
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  Alert,
  NativeModules,
  DeviceEventEmitter,
  Linking,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const App = () => {
  const [holderName, setCardHolder] = useState('Hussamadin');
  const [cardNumber, setCardNumber] = useState('4111111111111111');
  const [expiryMonth, setExpiryMonth] = useState('05');
  const [expiryYear, setExpiryYear] = useState('2021');

  const [cvv, setCvv] = useState('123');
  //const [checkoutID, setCheckoutId] = useState("null");
  useEffect(() => {
    Linking.addEventListener('url', e => {
      const {url} = e;
      if (url) {
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
          console.log(match[1], match[2]);
        }
        const {id, resourcePath} = params;
        getPaymentStatus(id);
      } else {
        fetchPaymentUI();
      }
      console.log('url', e);
    });
    // Linking.getInitialURL().then((url) => {
    //   if (url) {
    //     console.log('Initial url is: ' + url);
    //   }
    // }).catch(err => console.error('An error occurred', err));
  }, []);

  const getPaymentStatus = async id => {
    //TODO replace url with
    try {
      let res = await axios({
        method: 'post',
        url: 'http://saib.gate2play.com/hussam/payment.php',
        // url: 'https://test.oppwa.com/',
        headers: {},
        data: {
          method: 'check_payment',
          resourcePath: id,
          //cart: cartdata
        },
      });
      console.log(res);
      //TODO
      //if(res === 'success){
      //  done
      //} else {
      //return fetchPaymentUI();
      //  }
      return fetchPaymentUI();
    } catch (err) {
      console.log(err);
    }
  };

  handlepay = async () => {
    //replace this url with your server side file url
    try {
      let response = await axios({
        method: 'post',
        url: 'http://saib.gate2play.com/hussam/payment.php',
        // url: 'https://test.oppwa.com/',
        headers: {},
        data: {
          method: 'payment',
          amount: '100',
        },
      });

      const checkoutId = response.data.checkoutId;
      console.log(checkoutId);
      //    setCheckoutId(checkoutId);
      if (checkoutId) {
        const paymentParams = {
          checkoutID: checkoutId,
          paymentBrand: 'VISA',
          cardNumber: cardNumber,
          holderName: holderName,
          expiryMonth: expiryMonth,
          expiryYear: expiryYear,
          cvv: cvv,
        };
        console.log(paymentParams);
        let transactionResult = await NativeModules.Hyperpay.transactionPayment(
          paymentParams,
        );

        console.log(transactionResult);
        if (transactionResult.status === 'pending') {
          Linking.openURL(transactionResult.redirectURL);
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const fetchPaymentUI = () => {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCardHolder(text)}
              value={holderName}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCardNumber(text)}
              value={cardNumber}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setExpiryMonth(text)}
              value={expiryMonth}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setExpiryYear(text)}
              value={expiryYear}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCvv(text)}
              value={cvv}
            />
          </View>

          <View style={styles.body}>
            <Button title="Press me" onPress={() => handlepay()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCardHolder(text)}
              value={holderName}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCardNumber(text)}
              value={cardNumber}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setExpiryMonth(text)}
              value={expiryMonth}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setExpiryYear(text)}
              value={expiryYear}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => setCvv(text)}
              value={cvv}
            />
          </View>

          <View style={styles.body}>
            <Button title="Press me" onPress={() => handlepay()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
```
