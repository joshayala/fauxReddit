export const API_ROOT = "https://www.reddit.com";

const RETRY_DELAY_MS = 1000;

const fetchWithRetry = async (url, { signal } = {}) => {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        let errorMessage = `${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = `${response.status} - ${errorData.message || response.statusText}`;
        } catch {
          // keep default errorMessage
        }
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Don't retry on abort or 4xx client errors
      if (
        error.name === "AbortError" ||
        (error.status >= 400 && error.status < 500)
      ) {
        throw error;
      }
      lastError = error;
      if (attempt < 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
};

// This is going to the Reddit Slice
export const getSubredditPosts = async (subreddit, { signal } = {}) => {
  const json = await fetchWithRetry(
    `${API_ROOT}${subreddit}/.json?raw_json=1`,
    { signal },
  );
  return json.data.children.map((post) => post.data);
};

//This is going to the Subeddit Slice
export const getSubreddits = async ({ signal } = {}) => {
  const json = await fetchWithRetry(`${API_ROOT}/subreddits.json?raw_json=1`, {
    signal,
  });
  return json.data.children.map((subreddit) => subreddit.data);
};

//This is going to the Reddit Slice
export const getPostComments = async (permalink, { signal } = {}) => {
  const json = await fetchWithRetry(`${API_ROOT}${permalink}.json`, { signal });
  return json[1].data.children.map((subreddit) => subreddit.data);
};

//This is going to the Reddit Slice for the Header Component to use.
export const getSubredditsbySearch = async (searchTerm, { signal } = {}) => {
  const json = await fetchWithRetry(
    `${API_ROOT}/search.json?q=${encodeURIComponent(searchTerm)}`,
    { signal },
  );
  return json.data.children.map((post) => post.data);
};
