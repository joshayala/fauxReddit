export const API_ROOT = 'https://www.reddit.com';

export const getSubredditPosts = async (subreddit) => {
  const response = await fetch(`${API_ROOT}${subreddit}.json`);
  const json = await response.json();

  return json.data.children.map((post) => post.data);
};

export const getSubreddits = async () => {
  const response = await fetch(`${API_ROOT}/subreddits.json`);
  const json = await response.json();

  return json.data.children.map((subreddit) => subreddit.data);
};

export const getPostComments = async (permalink) => {
  const response = await fetch(`${API_ROOT}${permalink}.json`);
  const json = await response.json();

  return json[1].data.children.map((subreddit) => subreddit.data);
};

export const search = async ({ searchTerm = '', after = '', before = '', count }) => {
    try {
        const queryParams = new URLSearchParams({
            q: searchTerm,
            after,
            before,
            count,
            limit: '25',
        });
        const response = await fetch(`${API_ROOT}/search.json?${queryParams}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${response.status}: ${errorData.code}- ${errorData.message}`);
        }
        const json = await response.json();

        const postsWithLogo = await Promise.all(json.data.children.map(async (post) => {
            const logoUrl = await getSubredditLogo(post.data.subreddit_name_prefixed);
            return { ...post, data: {...post.data, icon_img: logoUrl} };
        }));  
        const completeObject = {
            ...json, 
            data:{
                ...json.data,
                children: postsWithLogo
            }
        }
        return completeObject        
    } catch (error) {
        throw Error (error);      
    } 
    
}

export const getSubredditLogo = async (subredditName) => {
    try {
        const response = await fetch(`${API_ROOT}/${subredditName}/about.json`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${response.status} - ${errorData.message}`);
        }
        const json = await response.json();
        return json.data.icon_img;        
    } catch (error) {
        throw Error (error);    
    }    
}