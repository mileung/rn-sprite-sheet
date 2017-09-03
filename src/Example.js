import React from 'react';
import {
  View,
  Image,
  Animated,
  Button
} from 'react-native';
import SpriteSheet from './SpriteSheet';

export default class Example extends React.Component {
  render() {
    return (
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
            walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            jump: [4, 2, 5]
          }}
        />
        <Button
          onPress={this.walk}
          title="walk"
        />
        <Button
          onPress={this.stop}
          title="stop"
        />
      </View>
    );
  }

  walk = () => {
    this.mummy.play('walk', 20, () => console.log('walk animation complete'))
  }

  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  }
}
