(function () {
    // Navigation controls
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });

    // Theme toggle
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

    // GitHub repositories fetch
    const githubUsername = "vlader122";
    const reposContainer = document.getElementById("github-repos");

    // Language colors mapping
    const languageColors = {
        JavaScript: "#f1e05a",
        TypeScript: "#2b7489",
        Python: "#3572A5",
        Java: "#b07219",
        "C#": "#178600",
        "C++": "#f34b7d",
        C: "#555555",
        Go: "#00ADD8",
        Rust: "#dea584",
        Ruby: "#701516",
        PHP: "#4F5D95",
        Swift: "#ffac45",
        Kotlin: "#A97BFF",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Shell: "#89e051",
        Vue: "#41b883",
        React: "#61dafb",
        Angular: "#dd0031",
        Dart: "#00B4AB",
        SQL: "#e38c00",
        "Jupyter Notebook": "#DA5B0B"
    };

    async function fetchGitHubRepos() {
        if (!reposContainer) return;

        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const repos = await response.json();
            
            // Filter out forks and archived repos, then sort by stars
            const filteredRepos = repos
                .filter(repo => !repo.fork && !repo.archived)
                .sort((a, b) => b.stargazers_count - a.stargazers_count);

            renderRepos(filteredRepos);
        } catch (error) {
            console.error("Error fetching GitHub repos:", error);
            reposContainer.innerHTML = `
                <div class="error-repos">
                    <i class="fas fa-exclamation-circle"></i> 
                    Failed to load repositories. 
                    <a href="https://github.com/${githubUsername}" target="_blank" style="color: var(--color-secondary);">
                        View on GitHub
                    </a>
                </div>
            `;
        }
    }

    function renderRepos(repos) {
        if (repos.length === 0) {
            reposContainer.innerHTML = `
                <div class="error-repos">
                    No public repositories found.
                </div>
            `;
            return;
        }

        const reposHTML = repos.map(repo => {
            const langColor = repo.language ? (languageColors[repo.language] || "#8b949e") : "#8b949e";
            const description = repo.description || "No description available";
            const topics = repo.topics?.slice(0, 3) || [];
            
            return `
                <div class="repo-card">
                    <div class="repo-header">
                        <a href="${repo.html_url}" target="_blank" class="repo-name">
                            <i class="fas fa-book" style="margin-right: 0.5rem; color: var(--color-grey-3);"></i>
                            ${repo.name}
                        </a>
                        <span class="repo-visibility">${repo.visibility}</span>
                    </div>
                    <div class="repo-description">${description}</div>
                    <div class="repo-meta">
                        ${repo.language ? `
                            <span class="repo-language">
                                <span class="lang-color" style="background-color: ${langColor};"></span>
                                ${repo.language}
                            </span>
                        ` : ""}
                        <span>
                            <i class="far fa-star"></i> ${repo.stargazers_count}
                        </span>
                        <span>
                            <i class="fas fa-code-branch"></i> ${repo.forks_count}
                        </span>
                        <span>
                            <i class="far fa-clock"></i> ${formatDate(repo.updated_at)}
                        </span>
                    </div>
                    ${topics.length > 0 ? `
                        <div class="repo-topics">
                            ${topics.map(topic => `<span class="topic">${topic}</span>`).join("")}
                        </div>
                    ` : ""}
                </div>
            `;
        }).join("");

        reposContainer.innerHTML = reposHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    // Fetch repos when page loads
    fetchGitHubRepos();
})();
