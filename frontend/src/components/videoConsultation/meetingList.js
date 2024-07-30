import Button from '../common/Button';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';
import { handleApiError } from '@/utils/apiHelpers';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const MeetingList = ({ meetingsList, router }) => {
  console.log(meetingsList);
  let meetings = meetingsList?.map((meeting, index) => {
    const day = new Date(meeting.Geburtsdatum).getDay();
    const month = new Date(meeting.Geburtsdatum).getMonth() + 1;
    const year = new Date(meeting.Geburtsdatum).getFullYear();

    return (
      <div
        className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]"
        style={{ marginBottom: '10px' }}
        key={index}
      >
        <div className="xs:w-[6%] sm:w-[6%] md:w-[3%] lg:w-[5%] xl:w-[6%] xs:text-left sm:text-right"></div>
        <div
          className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]"
          onClick={() => {
            if (navigator?.clipboard && meeting?.url) {
              navigator.clipboard.writeText(meeting?.url);
              toast.success('copied to clipboard');
            }
          }}
        >
          {`{{URL}}`}
        </div>
        <div
          className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]"
          onClick={() => {
            if (navigator?.clipboard && meeting?.accessKey) {
              navigator.clipboard.writeText(meeting?.accessKey);
              toast.success('copied to clipboard');
            }
          }}
        >
          {`{{Code}}`}
        </div>
        <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
          {`${day}.${month}.${year}`}
        </div>
        <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
          {`${meeting.meetingTime.hour}`}:{`${meeting.meetingTime.minutes}`}
        </div>
        <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
          {`{{${meeting.Vorname}}} {{${meeting.Nachname}}}`}
        </div>
        <div>
          <Button
            size="xm"
            varient="primary"
            className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
            onClick={() => {
              // const accessKey = meeting?.accessKey;
              // const user = userName;
              // if (accessKey && user) {
              //   // router.push(
              //   //   `${process.env.NEXT_PUBLIC_RTC_HOST}/rtc?accessKey=${accessKey}&clientName=${user}`
              //   // );
              // }
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
                let userData = localStorage?.getItem('psymax-user-data');

                if (userData) {
                  userData = JSON.parse(userData);
                }

                if (meetingId) {
                  const meetingRes = await axiosInstance.delete(
                    `/meetings/delete/${meetingId}`
                  );

                  if (meetingRes.status === 204) {
                    toast.success('Treffen gelöscht');
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
    );
  });
  return meetings;
};

export default MeetingList;
