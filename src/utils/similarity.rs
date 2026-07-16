pub fn levenshtein(a: &str, b: &str) -> usize {
    let a_chars: Vec<char> = a.chars().collect();
    let b_chars: Vec<char> = b.chars().collect();
    let a_len = a_chars.len();
    let b_len = b_chars.len();

    let mut matrix = vec![vec![0usize; b_len + 1]; a_len + 1];

    for i in 0..=a_len {
        matrix[i][0] = i;
    }
    for j in 0..=b_len {
        matrix[0][j] = j;
    }

    for i in 1..=a_len {
        for j in 1..=b_len {
            let cost = if a_chars[i - 1] == b_chars[j - 1] {
                0
            } else {
                1
            };

            matrix[i][j] = (matrix[i - 1][j] + 1)
                .min(matrix[i][j - 1] + 1)
                .min(matrix[i - 1][j - 1] + cost);
        }
    }

    matrix[a_len][b_len]
}

/// Similarity in `[0.0, 1.0]`: `1 - distance / max(len(a), len(b))`.
pub fn similarity(a: &str, b: &str) -> f64 {
    let length = a.chars().count().max(b.chars().count());
    if length == 0 {
        return 1.0;
    }
    let distance = levenshtein(a, b);
    1.0 - (distance as f64) / (length as f64)
}

pub fn sort_by_similarity(arr: &mut [String], target: &str) {
    arr.sort_by(|a, b| {
        let sa = similarity(a, target);
        let sb = similarity(b, target);
        sb.partial_cmp(&sa).unwrap_or(std::cmp::Ordering::Equal)
    });
}
