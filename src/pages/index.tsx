import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";
import { ListPostsQuery, Post } from "../API";
import { Container } from "@material-ui/core";
import PostPreview from "../components/PostPreview";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  // Make a request to the GraphQL API
  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };

      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromApi();
  }, []);

  console.log("USER:", user);
  console.log("Posts:", posts);

  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}

// Get all the posts on the server-side
// Since all users can read posts in our schema logic
// We can use the API Key authorization method

// We'll call code to access our GraphQL API on the server-side
// Pass it to our function as props
//
