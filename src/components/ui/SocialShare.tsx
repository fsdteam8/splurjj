import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";

const SocialShare = ({
  url,
  title,
  summary,
}: {
  url: string;
  title: string;
  summary?: string;
}) => {
  return (
    <div className="flex gap-3 mt-4">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} separator=":: ">
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} title={title} summary={summary}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={40} round />
      </TelegramShareButton>
    </div>
  );
};

export default SocialShare;



