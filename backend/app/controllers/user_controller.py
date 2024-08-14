def get_user_with_posts(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        user_data = {"id": user.id, "username": user.username, "posts": []}
        user_data["posts"] = [{"id": post.id, "title": post.title, "content": post.content} for post in user.posts]
        return jsonify(user_data), 200
    return jsonify({"message": "User not found"}), 404
