export interface CirclePropTypes {
    imageStyle?: object;
    circleSize: number;
    face: { id: number; imageUrl: string };
    offset: number;
  }
  
export interface FacePilePropTypes {
    faces: { id: number; imageUrl: string }[];
    circleSize?: number;
    hideOverflow?: boolean;
    containerStyle?: object;
    circleStyle?: object;
    imageStyle?: object;
    overflowStyle?: object;
    overflowLabelStyle?: object;
    render?: () => React.ReactNode;
    numFaces?: number;
    offset?: number;
  }