import json
import pytest
from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded

@pytest.mark.integration
def test_rpgf_integration():
    # Deploy the RPGF contract
    factory = get_contract_factory("RPGF")
    contract = factory.deploy()
    
    # Assert initial state
    initial_count = contract.get_submission_count(args=[]).call()
    assert initial_count == 0

    # Invoke the submit_project method (transact)
    # This executes a real consensus flow with the actual LLM and web requests
    receipt = contract.submit_project(args=[
        "https://en.wikipedia.org/wiki/Public_good_(economics)", 
        "A project providing knowledge about public goods."
    ]).transact()
    
    # Assert that the transaction was accepted and successfully executed
    assert tx_execution_succeeded(receipt)

    # Call the read method to verify state updated correctly
    new_count = contract.get_submission_count(args=[]).call()
    assert new_count == 1
    
    # Verify the summary cache is populated
    summary_str = contract.get_summary(args=["https://en.wikipedia.org/wiki/Public_good_(economics)"]).call()
    assert summary_str is not None
    assert len(summary_str) > 0
