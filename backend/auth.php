<?php
// auth.php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $action = $data['action'] ?? '';

    if ($action === 'register') {
        $email = $data['email'];
        $password = $data['password'];
        $name = $data['name'];

        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists']);
            exit;
        }

        // Hash password
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Insert user
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)");
        if ($stmt->execute([$email, $hash, $name])) {
            echo json_encode(['success' => true, 'message' => 'User registered']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }

    } elseif ($action === 'login') {
        $email = $data['email'];
        $password = $data['password'];

        $stmt = $pdo->prepare("SELECT id, name, password_hash FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // In a real app, generate a JWT token here. 
            // For simplicity, we'll return the user ID (NOT SECURE for production without tokens, but okay for MVP)
            echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name']]]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }
}
?>
