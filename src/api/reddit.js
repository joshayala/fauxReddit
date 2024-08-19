export const API_ROOT = 'https://www.reddit.com';

// This is going to the Reddit Slice
export const getSubredditPosts = async (subreddit) => {
  const response = await fetch(`${API_ROOT}${subreddit}/.json?raw_json=1`);
  const json = await response.json();

  return json.data.children.map((post) => post.data);
};

//This is going to the Subeddit Slice
export const getSubreddits = async () => {
  const response = await fetch(`${API_ROOT}/subreddits.json?raw_json=1`);
  const json = await response.json();

  return json.data.children.map((subreddit) => subreddit.data);
};

//This is going to the Reddit Slice
export const getPostComments = async (permalink) => {
  const response = await fetch(`${API_ROOT}${permalink}.json`);
  const json = await response.json();

  return json[1].data.children.map((subreddit) => subreddit.data);
};

//This is going to the Reddit Slice for the Header Component to use.
export const getSubredditsbySearch = async (searchTerm) => {
    try {
        const response = await fetch(`${API_ROOT}/search.json?q=${searchTerm}`);
        
        if (!response.ok) {
            // Attempt to parse error response as JSON
            let errorMessage = `${response.status} - ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = `${response.status} - ${errorData.message || response.statusText}`;
            } catch (jsonError) {
                // If parsing fails, use the status text
                errorMessage = `${response.status} - ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const json = await response.json();
         
        return json.data.children.map((post) => post.data); 
        
    } catch (error) {
        // Rethrow the original error
        throw error;       
    }     
};
