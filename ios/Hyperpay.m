//
//  Hyperpay.m
//  hyperRn
//
//  Created by Hyperpay on 15/06/1441 AH.
//  Copyright © 1441 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Hyperpay.h"
#import <React/RCTLog.h>
@implementation Hyperpay

OPPPaymentProvider *provider;




RCT_EXPORT_MODULE(Hyperpay)

-(instancetype)init
{
    self = [super init];
    if (self) {
      #ifdef DEBUG
        provider = [OPPPaymentProvider paymentProviderWithMode:OPPProviderModeTest];
     #else
        provider = [OPPPaymentProvider paymentProviderWithMode:OPPProviderModeTest];
     #endif
    }
    
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onTransactionComplete"];
}

/**
 React Native functions
 */

RCT_EXPORT_METHOD(transactionPayment: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSError * _Nullable error;
   
  for (NSString *key in options) {
        NSLog(@"key: %@, value: %@ \n", key, [options valueForKey:key]);
    }
    OPPCardPaymentParams *params = [OPPCardPaymentParams cardPaymentParamsWithCheckoutID:[options valueForKey:@"checkoutID"]

                                                                        paymentBrand:[options valueForKey:@"paymentBrand"]
                                                                              holder:[options valueForKey:@"holderName"]
                                                                              number:[options valueForKey:@"cardNumber"]
                                                                         expiryMonth:[options valueForKey:@"expiryMonth"]
                                                                          expiryYear:[options valueForKey:@"expiryYear"]
                                                                                 CVV:[options valueForKey:@"cvv"]
                                                                               error:&error];
 


    if (error) {
      NSLog(@"%s", "error");

      reject(@"transactionPayment",error.localizedDescription, error);
    } else {
       params.shopperResultURL = @"org.reactjs.native.example.HyperPaySupt.payments://result";
      
      //params.tokenizationEnabled = YES;
      OPPTransaction *transaction = [OPPTransaction transactionWithPaymentParams:params];

      [provider submitTransaction:transaction completionHandler:^(OPPTransaction * _Nonnull transaction, NSError * _Nullable error) {
        NSDictionary *transactionResult;
        if (transaction.type == OPPTransactionTypeAsynchronous) {
          // Open transaction.redirectURL in Safari browser to complete the transaction
//
//          [self sendEventWithName:@"onSessionConnect" body:@{@"redirectURL": transaction.redirectURL.absoluteString, @"status":@"pending",
//                                                             @"checkoutID":transaction.paymentParams.checkoutID
//          }];
          NSLog(@"%s", "aysnc");
          NSLog(@"%@", transaction.redirectURL.absoluteString);
          
           transactionResult = @{
          @"redirectURL":transaction.redirectURL.absoluteString,
          @"status":@"pending",
          @"checkoutId":transaction.paymentParams.checkoutID
          };
          resolve(transactionResult);
        }  else if (transaction.type == OPPTransactionTypeSynchronous) {
           NSLog(@"%s", "sync");
          transactionResult = @{
          @"status":@"completed",
          @"checkoutId":transaction.paymentParams.checkoutID
          };
          resolve(transactionResult);
        } else {
          NSLog(@"%s", "error payment");

          reject(@"transactionPayment",error.localizedDescription, error);
          // Handle the error
        }
      }];
    }
}

RCT_EXPORT_METHOD(tokenizedTransaction: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSError * _Nullable error;
  
 
  OPPTokenPaymentParams *tokenParams = [OPPTokenPaymentParams tokenPaymentParamsWithCheckoutID:[options valueForKey:@"checkoutID"] tokenID:[options valueForKey:@"tokenID"] paymentBrand:[options valueForKey:@"paymentBrand"] error:&error];
  if (error) {
      // See error.code (OPPErrorCode) and error.localizedDescription to identify the reason of failure.
    reject(@"tokenizedTransaction",error.localizedDescription, error);
  }else{
    OPPTransaction *transaction = [OPPTransaction transactionWithPaymentParams:tokenParams];
    
    
    [provider submitTransaction:transaction completionHandler:^(OPPTransaction * _Nonnull transaction, NSError * _Nullable error) {
      if (transaction.type == OPPTransactionTypeAsynchronous) {
        // Open transaction.redirectURL in Safari browser to complete the transaction
      }  else if (transaction.type == OPPTransactionTypeSynchronous) {
       resolve(transaction);
      } else {
        reject(@"tokenizedTransaction",error.localizedDescription, error);
        // Handle the error
      }
    }];
    
    
  }
  
  
  
  
}


RCT_EXPORT_METHOD(validateCardInfo:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  if(![OPPCardPaymentParams isHolderValid:[options valueForKey:@"cardNumber"]]){
    reject(@"validateCardInfo", @"invalid card number",nil);
  }else if(![OPPCardPaymentParams isCvvValid:[options valueForKey:@"cvv"]]){
    reject(@"validateCardInfo", @"invalid CVV", nil);
  }else if(![OPPCardPaymentParams isExpiryYearValid:[options valueForKey:@"expiryYear"]]){
             reject(@"validateCardInfo", @"invalid expiry Year", nil);
  }else if(![OPPCardPaymentParams isExpiryMonthValid:[options valueForKey:@"expiryMonth"]]){
    reject(@"validateCardInfo", @"invalid expiry month", nil);
  }else if(![OPPCardPaymentParams isExpiredWithExpiryMonth:[options valueForKey:@"expiryMonth"] andYear:[options valueForKey:@"expiryYear"]]){
    reject(@"validateCardInfo", @"Card is expiried", nil);
  }else{
    resolve([NSNull null]);
  }
}

@end
