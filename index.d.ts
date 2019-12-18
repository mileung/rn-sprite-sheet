import { MutableRefObject, PureComponent } from 'react';
import { StyleProp, ViewStyle, ImageStyle } from "react-native";

type AnimationConfig = {
    [name: string]: number[]
};

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];

export interface ISpriteSheetProps {
    source: number, // source must be required; { uri } will not work
    columns: number,
    rows: number,
    ref: MutableRefObject<SpriteSheet | null>,
    animations: AnimationConfig, // see example
    viewStyle?: StyleProp<ViewStyle>, // styles for the sprite sheet container
    imageStyle?: StyleProp<ImageStyle>, // styles for the sprite sheet
    height?: number, // set either height, width, or none,
    width?: number, // but not both height and width
    onLoad?: () => void
}

export class SpriteSheet extends PureComponent<RequireOnlyOne<ISpriteSheetProps, "height" | "width">, {}> {
    play: (config: {
        type: string,
        fps?: number,
        loop?: boolean,
        resetAfterFinish?: boolean,
        onFinish?: () => void
    }) => void;
    stop: (cb?: (value: number) => void) => void;
    reset: (cb?: (value: number) => void) => void;
}

export default SpriteSheet;
