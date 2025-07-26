"use client";

import dynamic from "next/dynamic";

const WhatsAppChat = dynamic(
  () => import("@/components/shared/socials/Whatsapp"),
  {
    ssr: false,
    loading: () => null,
  }
);

const MessengerChat = dynamic(
  () => import("@/components/shared/socials/Messanger"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ClientSideChats() {
  return (
    <>
      <WhatsAppChat
        phoneNumber=""
        defaultMessage="Hello from SBuilding group website"
      />

      {process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID && (
        <MessengerChat
          pageId={process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID}
          defaultMessage="Hello from SBuilding group website"
        />
      )}
    </>
  );
}
