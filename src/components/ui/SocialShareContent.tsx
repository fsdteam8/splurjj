"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { RiShareForwardLine } from "react-icons/ri";

interface ShareComponentProps {
  postId: string;
  categoryId: string;
  subcategoryId: string;
  heading: string;
  subHeading?: string;
  initialSharesCount?: number;
  token?: string; 
  id: number;
}

const SocialShare = ({
  url,
  title,
  summary,
  postId,
  onShare,
}: {
  url: string;
  title: string;
  summary?: string;
  postId: string;
  onShare: (postId: string) => void;
}) => {
  return (
    <div className="flex gap-3">
      <FacebookShareButton
        url={url}
        quote={title}
        onClick={() => onShare(postId)}
      >
        <FacebookIcon className="w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10" round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        onClick={() => onShare(postId)}
      >
        <TwitterIcon className="w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10" round />
      </TwitterShareButton>
      <WhatsappShareButton
        url={url}
        title={title}
        separator=":: "
        onClick={() => onShare(postId)}
      >
        <WhatsappIcon className="w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10" round />
      </WhatsappShareButton>
      <LinkedinShareButton
        url={url}
        title={title}
        summary={summary}
        onClick={() => onShare(postId)}
      >
        <LinkedinIcon className="w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10" round />
      </LinkedinShareButton>
      <TelegramShareButton
        url={url}
        title={title}
        onClick={() => onShare(postId)}
      >
        <TelegramIcon className="w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10" round />
      </TelegramShareButton>
    </div>
  );
};

const useSharePost = (id: number, token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["share-post", id],
    mutationFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${id}/share`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-hero-section"] });
      queryClient.invalidateQueries({ queryKey: ["share-count", id] });
    },
    onError: (error) => {
      console.error("Error sharing post:", error);
    },
  });
};

const useShareCount = (id: number, token?: string) => {
  return useQuery({
    queryKey: ["share-count", id],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${id}/share`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json()),
    enabled: !!id && !!token, // Only fetch if postId and token are valid
  });
};

const SocialShareContent: React.FC<ShareComponentProps> = ({
  postId,
  categoryId,
  subcategoryId,
  heading,
  subHeading,
  initialSharesCount = 0,
  token,
  id,
}) => {
  const [activeSharePostId, setActiveSharePostId] = useState<string | null>(
    null
  );
  const { mutate: sharePost } = useSharePost(id, token);
  const { data: shareCountData } = useShareCount(id, token);

  const toggleShare = () => {
    setActiveSharePostId(activeSharePostId === postId ? null : postId);
  };

  const getShareUrl = (): string => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${categoryId}/${subcategoryId}/${postId}`;
  };

  const handleShare = () => {
    sharePost(); // Trigger the share API call
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".share-container")) {
        setActiveSharePostId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 relative share-container">
      <button type="button" onClick={toggleShare}>
        <RiShareForwardLine className="w-6 h-6 cursor-pointer" />
      </button>
      <p className="text-lg font-medium text-black dark:text-white leading-normal">
        {shareCountData?.shares_count || initialSharesCount}
      </p>
      {activeSharePostId === postId && (
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-white shadow-lg rounded-xl p-3 
          flex flex-wrap gap-3 w-[234px] sm:w-auto max-w-[90vw]"
        >
          <SocialShare
            url={getShareUrl()}
            title={heading ? "" : ""}
            summary={subHeading || "Check out this post!"}
            postId={postId}
            onShare={handleShare}
          />
        </div>
      )}
    </div>
  );
};

export default SocialShareContent;
