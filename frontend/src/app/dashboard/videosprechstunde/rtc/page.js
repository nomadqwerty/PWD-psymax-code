import FullRtc from '../../../../components/rtcComponents/FullRTC/FullRtc';
import { Suspense } from 'react';

export default function Rtc() {
  return (
    <Suspense>
      <FullRtc />
    </Suspense>
  );
  // return (<Lobby></Lobby>)
}
