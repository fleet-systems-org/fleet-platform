# Prototype Back clearance and route text scale

Context: Stage 1b attempted to move the review Back button into document flow. The Stage 1c owner review found that it still overlapped cost rows and route captions; route SVG text also grew with available width.

Cause: `body .proto-back` lost the cascade to the engine's `body.proto-focus .proto-back`. SVG viewBox text followed the drawing scale rather than the design-system text roles.

Resolution: the prototype bridge now matches the engine selector specificity and loads after it. Back is static, after the document; the frame retains bottom clearance. Route geometry has fixed token-based height; labels are HTML with existing text roles. The engine source remains byte-identical.

Verification: isolated browser traversal at 1440 and 320 CSS pixels measures Back in normal flow below each of the 19 screen frames at scroll end. The route drawing measures 36 px high at both widths, with 12 px label-role text. The run log records the complete validation result.

Prevention proposal, not a standing rule: Stage 3's navigation suite should retain these measured overlap/overflow assertions for all screens and both widths. The first occurrence was recorded in Stage 1b progress; the second in this Stage 1c correction. Reuse the navigation runner rather than introducing another browser framework.
