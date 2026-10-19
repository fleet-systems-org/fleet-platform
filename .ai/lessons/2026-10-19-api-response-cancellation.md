# Cancellation can occur while reading a response

- Context: the shared API client distinguishes cancellation, transport and protocol failures.
- Cause: fetch may resolve before the body finishes downloading; response.json() can then reject with AbortError. A generic JSON catch incorrectly classifies that as malformed data.
- Resolution: recognize cancellation both around fetch and while decoding the body; parser failures remain protocol errors.
- Verification: a synthetic response whose JSON reader rejects with AbortError returns ABORTED in the client test.
- Finding: response acquisition and body consumption are separate failure boundaries. No new standing process rule is proposed.
