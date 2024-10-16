import React from "react";
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
  font-weight: 400px;
  font-size: 15px;
  color: ${({ theme }) => theme.white};
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
  return (
    <Card>
      <LazyLoadImage
        alt={item?.prompt}
        style={{ borderRadius: "12px" }}
        width="100%"
        src={"data:image/jpeg;base64,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"}
      />
      <HoverOverlay>
        <Prompt>{item?.prompt}</Prompt>
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