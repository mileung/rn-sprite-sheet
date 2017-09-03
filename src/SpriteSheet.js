import React from 'react';
import {
  View,
  Image,
  Animated,
  Easing
} from 'react-native';
import resolveAssetSource from 'resolveAssetSource';
import PropTypes from 'prop-types';

const stylePropTypes = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
]);

export default class SpriteSheet extends React.Component {
  static propTypes = {
    source: PropTypes.number.isRequired,
    viewStyle: stylePropTypes,
    imageStyle: stylePropTypes,
    columns: PropTypes.number,
    rows: PropTypes.number,
    animations: PropTypes.object
  }

  static defaultPropTypes = {
    columns: 1,
    rows: 1,
    animations: {},
    interpolationRanges: {}
  }

  state = {
    imageHeight: 0,
    imageWidth: 0,
    defaultFrameHeight: 0,
    defaultFrameWidth: 0,
    topInputRange: [0, 1],
    topOutputRange: [0, 1],
    leftInputRange: [0, 1],
    leftOutputRange: [0, 1],
  }

  time = new Animated.Value(0)
  interpolationRanges = {}

  componentWillMount() {
    let { source, height, width, rows, columns } = this.props;

    let image = resolveAssetSource(source);

    this.setState({
      imageHeight: height ? height * rows : image.height,
      imageWidth: width ? width * columns : image.width,
      frameHeight: height || image.height / rows,
      frameWidth: width || image.width / columns
    }, this.generateInterpolationRanges);
  }


  render() {
    let {
      imageHeight,
      imageWidth,
      frameHeight,
      frameWidth,
      animationType
    } = this.state;
    let { viewStyle, imageStyle, rows, columns, height, width, source } = this.props;

    let { top = { in: [0, 0], out: [0, 0] }, left = { in: [0, 0], out: [0, 0] } } = this.interpolationRanges[animationType] || {};

    return (
      <View
        style={[
          viewStyle, {
          height: frameHeight,
          width: frameWidth,
          overflow: 'hidden'
        }]}>
        <Animated.Image
          source={source}
          style={[
            imageStyle, {
            height: imageHeight,
            width: imageWidth,
            top: this.time.interpolate({
              inputRange: top.in,
              outputRange: top.out
            }),
            left: this.time.interpolate({
              inputRange: left.in,
              outputRange: left.out
            })
          }]}
        />
      </View>
    );
  }

  generateInterpolationRanges = () => {
    let { animations } = this.props;

    for (let key in animations) {
      let { length } = animations[key];
      let input = [].concat(...Array.from(Array(length).keys()).map(i => [i, i + 0.99999999999]));

      this.interpolationRanges[key] = {
        top: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { y } = this.getFrameCoords(i);
            return [y, y];
          }))
        },
        left: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { x } = this.getFrameCoords(i);
            return [x, x];
          }))
        }
      };
    }
  }

  stop = cb => {
    this.time.stopAnimation(cb);
  }

  play = (type, fps = 24, loop = false, onFinish = () => {}) => {
    let { animations } = this.props;
    let { length } = animations[type];

    this.setState({ animationType: type }, () => {
      let animation = Animated.timing(this.time, {
        toValue: length,
        duration: length / fps * 1000,
        easing: Easing.linear
      });

      if (loop) {
        Animated.loop(animation).start();
      } else {
        animation.start(() => {
          this.time.setValue(0);
          onFinish();
        });
      }
    })
  }

  getFrameCoords = i => {
    let { rows, columns } = this.props;
    let { frameHeight, frameWidth } = this.state;

    let successionWidth = i * frameWidth;

    return {
      x: -successionWidth % (columns * frameWidth),
      y: -Math.floor(successionWidth / (columns * frameWidth)) * frameHeight
    };
  }
}
