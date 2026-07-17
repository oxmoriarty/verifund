import json
import pytest

def test_submit_project(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/rpgf.py")
    direct_vm.sender = direct_alice
    
    # Mock the web call (using regex wildcard '.*' to catch all)
    direct_vm.mock_web(".*", {"status": 200, "body": "Sample website content about a public good project."})
    
    # Mock the LLM call to return score 9.
    # We used response_format="json" in the contract, so we need to mock a valid JSON response string.
    mock_response = json.dumps({"score": 9, "summary": "Great public good project!"})
    direct_vm.mock_llm(".*", mock_response)
    
    # Execute the smart contract method
    contract.submit_project("https://example.com", "A cool project that helps everyone")
    
    # Verify the results
    assert contract.submission_count == 1
    
    # Access the cached summary
    summary_str = contract.summaries["https://example.com"]
    assert summary_str is not None
    
    summary_data = json.loads(summary_str)
    assert summary_data["score"] == 9
    assert summary_data["summary"] == "Great public good project!"
