import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./button";
import TextInput from "./TextInput";
import { AutoAwesome, CreateRounded } from "@mui/icons-material";
import { CreatePost, GenerateAIImage } from "../api";

const Form = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 9%;
  justify-content: center;
`;
const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;
const Actions = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
`;

const GenerateImageForm = ({
  post,
  setPost,
  createPostLoading,
  setGenerateImageLoading,
  generateImageLoading,
  setCreatePostLoading,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const generateImageFun = async () => {
    setGenerateImageLoading(true);
    setError(""); // Clear previous errors
  
    try {
      const res = await GenerateAIImage({ prompt: post.prompt });
      // Assuming GenerateAIImage sends the request to your /api/generateImage endpoint
      setPost({
        ...post,
        photo: res.data.photo, // Directly use the data URL from the response
      });
      // console.log("Generated Image:", res.data.photo);
      setGenerateImageLoading(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while generating the image."
      );
      setGenerateImageLoading(false);
    }
  };

  const createPostFun = async () => {
    setCreatePostLoading(true);
    setError("");

    try {
      await CreatePost(post);
      setCreatePostLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the post."
      );
      setCreatePostLoading(false);
    }
  };

  return (
    <Form>
      <Top>
        <Title>Generate Image with prompt</Title>
        <Desc>
          Write your prompt according to the image you want to generate!
        </Desc>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter your name.."
          name="name"
          value={post.name}
          handelChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Write a detailed prompt about the image . . . "
          name="name"
          rows="8"
          textArea
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        ** You can post the AI Generated Image to the Community **
        {/* {post.photo && (
          <img
            src={post.photo}
            alt="Generated AI"
            style={{ width: "100%", maxWidth: "500px", marginTop: "10px" }}
          />
        )} */}
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          flex
          leftIcon={<AutoAwesome />}
          isLoading={generateImageLoading}
          isDisabled={post.prompt === ""}
          onClick={generateImageFun}
        />
        <Button
          text="Post Image"
          flex
          type="secondary"
          leftIcon={<CreateRounded />}
          isLoading={createPostLoading}
          isDisabled={
            post.name === "" || post.prompt === "" || post.photo === ""
          }
          onClick={createPostFun}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImageForm;