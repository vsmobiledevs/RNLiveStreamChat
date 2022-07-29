import React, {useEffect, useState, useMemo} from 'react';
import {Text, View, Button} from 'react-native';

import {useActionCable, useChannel} from './src/components/hooks';

const App = ({params}) => {
  // const {actionCable} = useActionCable('wss://fair-fight.herokuapp.com/cable');
  const {actionCable} = useActionCable(
    'https://1d23-72-255-21-210.in.ngrok.io/cable',
  );
  const {subscribe, unsubscribe, send, connected} = useChannel(actionCable);

  const [data, setData] = useState('');

  useEffect(() => {
    try {
      subscribe(
        {
          channel: 'ConversationsChannel',
          channel_key: `conversations_channel`,
        },
        {
          received: x => {
            setData(x);
          },
          connected: () => {},
        },
      );
    } catch (err) {
      console.log('err', err);
    }
    return () => {
      unsubscribe();
    };
  }, []);

  const setupWebSocket = () => {
    var ws = new WebSocket('wss://fair-fight.herokuapp.com/cable');
    //  var ws = new WebSocket('wss://192.168.11.255:3000/cable');
    ws.onopen = () => {
      console.log('[Connected to the server]');
      // setServerState('Connected to the server');
      // connection opened
      //ws.send('something'); // send a message
    };
    // ws.onclose = e => {
    //   setServerState('Disconnected. Check internet or server.');
    //   // setDisableButton(true);
    // };
    ws.onerror = e => {
      console.log('[Error]', e);
      // setServerState(e.message);
    };
    // // ws.on('conversation_3_channel', e => {
    // //   console.log('[message recieved from channel]', e);
    // // });
    ws.onmessage = e => {
      console.log('[message recieved from channel]', e);
      // setServerState(e.data);
      // serverMessagesList.push(e.data);
      // setServerMessages([...serverMessagesList]);
    };
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {connected ? (
        <Text>Connected to Server</Text>
      ) : (
        <Text>Disconnected from Server</Text>
      )}
      {data === '' ? null : (
        <Text style={{marginTop: 10}}>{JSON.stringify(data)}</Text>
      )}
      <Button
        onPress={() => {
          send('click', {time: Date.now()});
        }}
        title="Send Action"
      />
    </View>
  );
};

export default App;
