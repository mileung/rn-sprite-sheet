import React from 'react';
import {
  View,
  Image,
  Animated,
  Button,
  Slider
} from 'react-native';
import SpriteSheet from './SpriteSheet';

export default class Example extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SpriteSheet
            ref={ref => this.mummy = ref}
            source={require('./assets/mummy.png')}
            // source={require('./assets/bigMummy.png')}
            columns={5}
            rows={4}
            // height={100}
            // width={100}
            animations={{
              walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              backwards: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            }}
          />
        </View>
        <View style={{ paddingVertical: 30 }}>
          <Button
            onPress={this.play}
            title="play"
          />
          <Button
            onPress={this.stop}
            title="stop"
          />
        </View>
      </View>
    );
  }

  play = () => {
    this.mummy.play('walk');
  }

  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  }
}
