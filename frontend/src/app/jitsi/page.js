"use client";
import { JitsiMeeting } from "@jitsi/react-sdk";
import Section from "@/utils/section/Section";
import styles from "./jitsi.module.scss";

export default function VideoChat({ user }) {

   
    const interfaceConfigOverwrite = {

        APP_NAME: 'psymax', //app name
        // Customize UI components here
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ],
        SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'calendar' ],
        DISABLE_RINGING: true,
        SHOW_JITSI_WATERMARK: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',
        DEFAULT_WELCOME_PAGE_LOGO_URL: 'https://your-logo-url.com/logo.png',
        DEFAULT_LOGO_URL: 'https://your-logo-url.com/logo.png',
        JITSI_WATERMARK_LINK: 'https://your-company-url.com',
        JITSI_WATERMARK_LINK_TARGET: '_blank',
        DISABLE_TRANSCRIPTION_SUBTITLES: true,
        ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,
        GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
        MOBILE_APP_PROMO: false,
        if (isModerator) {
            interfaceConfigOverwrite.TOOLBAR_ALWAYS_VISIBLE = true;
          }
        
        // TOOLBAR_ALWAYS_VISIBLE: true,
        // Add more customization options as needed
      };

      const displayName = "Admin" // this sets the name of the user accessing video chat. can be set to dynamic and set to user info for every instance created instance. "user.name"


      // const isModerator = user.role === 'moderator';
  
      // create dynamic set of info for any user accessing video chat
      const userData = {
        role: 'moderator',
        email: 'user@example.com',
        displayName: displayName
        // Add other user data as needed
      };

     
  return (
    <div className={`${styles.section95} ${styles.borderRed}`}>
        
      <JitsiMeeting
        className={styles.jitsi}
        // domain= {}
        roomName="Meeting with user 1" //set dynamic meeting name
        getIFrameRef=
        {(iframeRef) => {
          iframeRef.style.height = "98vh";
        }}
        interfaceConfigOverwrite={interfaceConfigOverwrite}
        displayName={displayName}
        userInfo={userData}
      >
       
      </JitsiMeeting>
    </div>
  );
}
