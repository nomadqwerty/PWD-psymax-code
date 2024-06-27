import Button from '../common/Button';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';
import { handleApiError } from '@/utils/apiHelpers';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const MeetingList = ({ userName, newMeeting, setNewMeeting }) => {
  const router = useRouter();
  const [meetingsState, setMeetingState] = useState();

  useEffect(() => {
    const getMeetings = async () => {
      let userData = localStorage?.getItem('psymax-user-data');

      if (userData) {
        userData = JSON.parse(userData);
        const meetingListRes = await axiosInstance.get(
          `/meetings/all/${userData._id}`
        );
        console.log(meetingListRes);
        if (meetingListRes.status === 200 && meetingListRes?.data?.data) {
          console.log(meetingListRes.data.data.meetings);
          setMeetingState(meetingListRes.data.data.meetings);
        }
      }
    };
    getMeetings().then(() => {
      console.log('new list');
    });
    setNewMeeting(null);
    console.log('setmeeting');
  }, [newMeeting]);

  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);

    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1; // Month is zero-based, so add 1
    const year = inputDate.getUTCFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    return formattedDate;
  };
  console.log(meetingsState);
  let meetings = meetingsState?.map((meeting, index) => {
    return (
      <Grid key={index} item xs={12} sm={12} md={6} xl={6}>
        <div
          className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4"
          key={`1${index}`}
        >
          <div className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer">
            <svg
              className="m-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="3"
                fill={`${true ? '#2B86FC' : '#EEEEEE'}`}
              />
              {true && (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                  fill="white"
                />
              )}
            </svg>
          </div>
          <div className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"></div>
          <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
            {formatDate(meeting?.scheduledDate)}
          </div>
          <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
            {meeting?.title}
          </div>
          <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
            <Button
              size="xm"
              varient="primary"
              className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
              onClick={() => {
                const accessKey = meeting?.accessKey;
                const user = userName;
                if (accessKey && user) {
                  router.push(
                    `${process.env.NEXT_PUBLIC_RTC_HOST}/rtc?accessKey=${accessKey}&clientName=${user}`
                  );
                }
              }}
            >
              einleiten
            </Button>
            <Button
              size="xm"
              varient="destructive"
              className="radius4 xs:my-2 md:mb-1 sm:mb-0"
              onClick={async () => {
                try {
                  const meetingId = meeting?._id;

                  if (meetingId) {
                    const meetingRes = await axiosInstance.delete(
                      `/meetings/delete/${meetingId}`
                    );

                    if (meetingRes.status === 204) {
                      toast.success('Treffen gelöscht');
                      setNewMeeting(true);
                    }
                  }
                } catch (error) {
                  handleApiError(error, router);
                }
              }}
            >
              Entfernen
            </Button>
          </div>
        </div>
      </Grid>
    );
  });
  return meetings;
};

export default MeetingList;
