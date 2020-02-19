/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

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
  NativeModules,
  Linking,
  DeviceEventEmitter,
  AsyncStorage,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const Payment = () => {
  const [dummyDeepLinkedUrl, setDummyDeepLinkedUrl] = useState(null);
  const [holderName, setCardHolder] = useState('Hussamadin');
  const [cardNumber, setCardNumber] = useState('4111111111111111');
  const [expiryMonth, setExpiryMonth] = useState('05');
  const [expiryYear, setExpiryYear] = useState('2021');
  const [message, setMessage] = useState('');
  const [cvv, setCvv] = useState('123');

  useEffect(() => {
    Linking.getInitialURL().then(async url => {
      const deepLinkUrl = await AsyncStorage.getItem('deepLinkUrl');
      if (url && url !== deepLinkUrl) {
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
          console.log(match[1], match[2]);
        }
        const {id, resourcePath} = params;
        if (id) {
          await AsyncStorage.setItem('deepLinkUrl', url);
          setDummyDeepLinkedUrl(url);
          getPaymentStatus(id);
        }
      } else {
        console.log('outside getintialUrl metho');
        // fetchCheckoutId();
      }
    });

    // Linking.addEventListener('url', e => {
    //   const {url} = e;
    //   console.log(url);
    //   if (url) {
    //     let regex = /[?&]([^=#]+)=([^&#]*)/g,
    //       params = {},
    //       match;
    //     while ((match = regex.exec(url))) {
    //       params[match[1]] = match[2];
    //       console.log(match[1], match[2]);
    //     }
    //     const {id, resourcePath} = params;
    //     getPaymentStatus(id);
    //   } else {
    //     fetchPaymentUI();
    //   }
    //   console.log('url', e);
    // });
  }, []);

  const onSessionConnect = event => {
    console.log(event);
    Linking.openURL(event.redirectUrl);
  };
  DeviceEventEmitter.addListener('transactionStatus', onSessionConnect);

  const getPaymentStatus = async id => {
    //TODO replace url with
    try {
      let res = await axios({
        method: 'post',
        url: 'http://saib.gate2play.com/hussam/payment.php',
        headers: {},
        data: {
          method: 'check_payment',
          resourcePath: id,
          //cart: cartdata
        },
      });
      console.log(res);
      if (res) {
        //dummyDeepLinkedUrl = null;
        setMessage(res.data.message);
      }
      //        TODO
      // if(res === 'success){
      //  done
      //} else {
      //  return Show again UI to user
      //  }
      return fetchPaymentUI();
    } catch (err) {
      console.log(err);
    }
  };

  const handlepay = async () => {
    //Generating checkout id
    console.log('Generating checkout id');
    try {
      let response = await axios({
        method: 'post',
        url: 'http://saib.gate2play.com/hussam/payment.php',
        headers: {},
        data: {
          method: 'payment',
          amount: '100',
        },
      });
      const checkoutId = response && response.data.checkoutId;
      console.log(checkoutId);
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
        let transactionResult = NativeModules.Hyperpay.transactionPayment(
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

          <Text style={{alignSelf: 'center', margin: 20, fontSize: 20}}>
            Response: {message}
          </Text>
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

export default Payment;
