import React from 'react';
import {
  SafeAreaView,
  View,
  Button,
  TextInput,
  Switch,
  Text,
  KeyboardAvoidingView
} from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

export default class Example extends React.Component {
  state = {
    loop: false,
    resetAfterFinish: false,
    fps: '16'
  };

  render() {
    const { fps, loop, resetAfterFinish } = this.state;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <SpriteSheet
              ref={ref => (this.mummy = ref)}
              source={require('./assets/mummy.png')}
              columns={9}
              rows={6}
              // height={200} // set either, none, but not both
              // width={200}
              imageStyle={{ marginTop: -1 }}
              animations={{
                walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                appear: Array.from({ length: 15 }, (v, i) => i + 18),
                die: Array.from({ length: 21 }, (v, i) => i + 33)
              }}
            />
          </View>
          <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button onPress={() => this.play('walk')} title="walk" />
              <Button onPress={() => this.play('appear')} title="appear" />
              <Button onPress={() => this.play('die')} title="die" />
              <Button onPress={this.stop} title="stop" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>FPS</Text>
              <TextInput
                style={{ flex: 1, borderBottomWidth: 1, fontSize: 16 }}
                value={fps}
                keyboardType="number-pad"
                onChangeText={fps => this.setState({ fps })}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>Loop</Text>
              <Switch value={loop} onValueChange={loop => this.setState({ loop })} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>Reset After Finish</Text>
              <Switch
                value={resetAfterFinish}
                onValueChange={val => this.setState({ resetAfterFinish: val })}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  play = type => {
    const { fps, loop, resetAfterFinish } = this.state;

    this.mummy.play({
      type,
      fps: Number(fps),
      loop: loop,
      resetAfterFinish: resetAfterFinish,
      onFinish: () => console.log('hi')
    });
  };

  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  };
}
