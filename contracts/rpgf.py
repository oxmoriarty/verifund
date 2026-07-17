# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
from genlayer import *

class RPGF(gl.Contract):
    summaries: TreeMap[str, str]
    submission_count: u256

    def __init__(self):
        self.summaries = TreeMap()
        self.submission_count = u256(0)

    @gl.public.write
    def submit_project(self, project_url: str, description: str):
        task = "Grade the project from 1 to 10 based on public good contribution."
        criteria = "Must return a valid evaluation score and summary string"
        
        def fetch_data():
            content = gl.nondet.web.render(project_url, mode='text')
            return f"Project Description: {description}\n\nWebsite Content:\n{content}"

        result = gl.eq_principle.prompt_non_comparative(
            fetch_data,
            task=task,
            criteria=criteria
        )
        
        # Ensure the result is stored as a string as required by TreeMap[str, str]
        if isinstance(result, dict):
            summary_str = json.dumps(result)
        else:
            summary_str = str(result)
            
        self.summaries[project_url] = summary_str
        self.submission_count += u256(1)

    @gl.public.view
    def get_submission_count(self) -> int:
        return int(self.submission_count)

    @gl.public.view
    def get_summary(self, project_url: str) -> str:
        return self.summaries.get(project_url, "")

    @gl.public.view
    def get_all_projects(self) -> list[dict]:
        projects = []
        for url, summary in self.summaries.items():
            projects.append({"url": url, "summary": summary})
        return projects
