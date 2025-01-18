import React, { useState } from "react";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Avatar } from "@mui/material";
import { DownloadRounded } from "@mui/icons-material";
import FileSaver from "file-saver";

const Card = styled.div`
  position: relative;
  display: flex;
  border-radius: 20px;
  box-shadow: 1px 2px 40px 8px ${({ theme }) => theme.black + 60};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 1px 2px 40px 8px ${({ theme }) => theme.black + 80};
    scale: 1.05;
  }
  &:nth-child(7n + 1) {
    grid-column: auto/span 2;
    grid-row: auto/span 2;
  }
`;

const HoverOverlay = styled.div`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.white};
  transition: opacity 0.3s ease;
  border-radius: 6px;
  justify-content: end;
  padding: 16px;

  ${Card}:hover & {
    opacity: 1;
  }
`;
const Prompt = styled.div`
  font-weight: 400;
  font-size: 15px;
  color: ${({ theme }) => theme.white};
  max-height: ${({ isExpanded }) => (isExpanded ? "100px" : "20px")};
  overflow-y: ${({ isExpanded }) => (isExpanded ? "auto" : "hidden")};
  transition: max-height 0.3s ease;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.yellow};
    border-radius: 4px;
  }
`;

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;

const PromptText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: ${({ isExpanded }) => (isExpanded ? "unset" : "1")};
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

const ViewMore = styled.span`
  color: ${({ theme }) => theme.yellow};
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
`;
const Author = styled.div`
  font-weight: 600px;
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${({ theme }) => theme.white};
`;

const ImageCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatePrompt = (prompt, maxLength = 50) => {
    if (!prompt) return "";
    if (!isExpanded && prompt.length > maxLength) {
      return `${prompt.substring(0, maxLength)}...`;
    }
    return prompt;
  };

  return (
    <Card>
      <LazyLoadImage
        alt={item?.prompt}
        style={{ borderRadius: "12px" }}
        width="100%"
        src={item?.photo}  // Use the actual photo from item
        effect="blur"  // Add loading blur effect
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'; // Fallback image if loading fails
        }}
      />
      <HoverOverlay>
        <PromptContainer>
          <Prompt isExpanded={isExpanded}>
            <PromptText isExpanded={isExpanded}>
              {truncatePrompt(item?.prompt)}
            </PromptText>
          </Prompt>
          {item?.prompt?.length > 50 && (
            <ViewMore 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Hide" : "Prompt"}
            </ViewMore>
          )}
        </PromptContainer>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Author>
            <Avatar sx={{ width: "32px", height: "32px" }}>
              {item?.name[0]}
            </Avatar>
            {item?.name}
          </Author>
          <DownloadRounded
            onClick={() => FileSaver.saveAs(item?.photo, "download.jpg")}
          />
        </div>
      </HoverOverlay>
    </Card>
  );
};

export default ImageCard;