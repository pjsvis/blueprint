#!/usr/bin/env python3
import sys
import json
import re

# High-signal lexical dictionary (zero dependencies, extreme performance)
POSITIVE_KEYWORDS = re.compile(
    r"\b(up|gain|gains|growth|high|success|innovative|breakthrough|profit|win|amazing|great|excellent|surge|surges|advance|leads|improved|stable|love|happy|smart|fast|modern|secure)\b",
    re.IGNORECASE,
)
NEGATIVE_KEYWORDS = re.compile(
    r"\b(down|loss|losses|crash|decline|low|failure|warning|drop|drops|fine|fined|sued|disaster|terrible|worst|plummet|plummets|debt|bankrupt|threat|bug|vulnerability|leak|fail)\b",
    re.IGNORECASE,
)

def calculate_sentiment(title: str) -> float:
    score = 0.0
    # Search for matches
    pos_matches = POSITIVE_KEYWORDS.findall(title)
    neg_matches = NEGATIVE_KEYWORDS.findall(title)
    
    score += len(pos_matches) * 0.35
    score -= len(neg_matches) * 0.35
    
    # Bound within canonical -1.0 to 1.0
    return max(-1.0, min(1.0, round(score, 2)))

def main():
    # Process lines from stdin and stream immediately to stdout
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
            title = data.get("title", "")
            data["sentiment"] = calculate_sentiment(title)
            
            # Print immediately as JSON Line
            sys.stdout.write(json.dumps(data) + "\n")
            sys.stdout.flush()
        except Exception as e:
            # Output error line but do not crash the pipeline
            sys.stderr.write(f"Error parsing line: {e}\n")
            sys.stderr.flush()

if __name__ == "__main__":
    main()
