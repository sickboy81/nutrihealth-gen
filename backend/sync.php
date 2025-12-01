<?php
// sync.php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $userId = $data['user_id'] ?? null;
    $type = $data['type'] ?? ''; // 'profile', 'goals', 'preferences', 'gamification'
    $payload = $data['data'] ?? null;

    if (!$userId || !$type || !$payload) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        exit;
    }

    // Upsert user_data
    // Note: This is a simplified example. In production, validate user ownership!
    
    $columnMap = [
        'profile' => 'profile_json',
        'goals' => 'daily_goals_json',
        'preferences' => 'preferences_json',
        'gamification' => 'gamification_json'
    ];

    if (!isset($columnMap[$type])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
        exit;
    }

    $column = $columnMap[$type];
    $jsonPayload = json_encode($payload);

    // Check if record exists
    $stmt = $pdo->prepare("SELECT user_id FROM user_data WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    if ($stmt->fetch()) {
        $sql = "UPDATE user_data SET $column = ? WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$jsonPayload, $userId]);
    } else {
        $sql = "INSERT INTO user_data (user_id, $column) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId, $jsonPayload]);
    }

    echo json_encode(['success' => true]);

} elseif ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user_id']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM user_data WHERE user_id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch();

    if ($result) {
        echo json_encode([
            'success' => true,
            'data' => [
                'profile' => json_decode($result['profile_json']),
                'goals' => json_decode($result['daily_goals_json']),
                'preferences' => json_decode($result['preferences_json']),
                'gamification' => json_decode($result['gamification_json'])
            ]
        ]);
    } else {
        echo json_encode(['success' => true, 'data' => null]);
    }
}
?>
