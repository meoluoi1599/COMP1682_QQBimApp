from flask import Flask, render_template,jsonify, json, request,send_from_directory,send_file
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

from flask_mail import Mail, Message

import random 

import os
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['JWT_SECRET_KEY'] = 'Meow meow meow'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:bim1@localhost/db_qqbimapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'qqbimapp@gmail.com'
app.config['MAIL_PASSWORD'] = 'quyen123456'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


socketio = SocketIO(app,cors_allowed_origins="*")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


FILE_DIRECTORY = "D:\QQBimApp\project_end_year\Images"
if not os.path.exists(FILE_DIRECTORY):
   os.makedirs(FILE_DIRECTORY)
app.config['UPLOAD_FOLDER'] = 'D:\QQBimApp\project_end_year\Images'

import mymodel 
from mymodel import database
database = database() 

class Book(db.Model):
    __tablename__ = 'tblStory'
    story_id = db.Column('story_id',db.Integer, primary_key=True)
    story_title = db.Column('story_title',db.String(200), nullable = False)
    author_id = db.Column('author_id',db.String(200), nullable = False)
    story_description = db.Column('story_description',db.String(2000))
    story_img = db.Column('story_img',db.String(200))
    category_id = db.Column('category_id',db.Integer)
    vote = db.Column('vote',db.Integer)
    parts = db.Column('parts',db.Integer)
    story_status = db.Column('story_status',db.String(50))
    
class User(db.Model):
    __tablename__ = 'tblUser'
    user_id = db.Column('user_id',db.Integer, primary_key=True)
    username = db.Column('username',db.String(50), nullable = False)
    user_pw = db.Column('user_pw',db.String(400))
    fullname = db.Column('fullname',db.String(200), nullable = False) 
    user_avatar = db.Column('user_avatar',db.String(200))
    user_email = db.Column('user_email',db.String(200))
    num_following = db.Column('num_following', db.Integer)
    num_follower = db.Column('num_follower', db.Integer)

#login for users
@app.route('/login', methods = ['POST'])
def login():
    token = ''
    username = request.json.get('username')
    get_password = str(request.json.get('password'))
    
    account = database.login((username,))
    name =''
    user_id = ''
    email = ''
    user_avatar= ''
    num_following=''
    num_follower = ''

    if account is None:
        return jsonify({'token':''})
    role = account['role']
    if account is not None:
        print(account)
        if role == 'user':
            db_password = account['user_pw']
            name = account['fullname']
            user_id = account['user_id']
            email = account['user_email']
            user_avatar = account['user_avatar']
            num_following = account['num_following']
            num_follower = account['num_follower']
        elif role == 'manager':
            db_password = account['user_pw']
            name = account['fullname']
            user_id = account['user_id']
            email = account['user_email']
            user_avatar = account['user_avatar']
    if bcrypt.check_password_hash(db_password, get_password): #if right, do below
        token = create_access_token(identity = username)
    return jsonify({'user_id':user_id,'token':token,'role':role,'username':username, 'name':name, 'email':email, 'user_avatar': user_avatar, 'num_following': num_following, 'num_follower': num_follower})

# reset password
@app.route('/code_password/<string:username>', methods = ['GET'])
def code_password(username):
    code = random.randint(100000,999999)
    account = database.code_password(username,code)
    if account != 0:
        gmail = account['user_email']
        msg1 = Message( 
            'Reset password', 
            body='This is your code ' + str(code),
            sender='QQBimApp', 
            recipients=[gmail,]  
        )
        mail.send(msg1)
    return jsonify(account)

@app.route('/check_code/<int:code>', methods = ['GET'])
def check_code(code):
    code = database.check_code(code)
    return jsonify(code)

@app.route('/reset_password', methods = ['POST'])
def reset_password():
    username = request.json.get('username')
    password = request.json.get('password')
    code = request.json.get('code')
    pw = bcrypt.generate_password_hash(str(password))
    values = (username, pw, code)
    result = database.reset_password(values)
    return jsonify({'row-affect': result})

# create account for user
@app.route('/signup', methods = ['POST'])
def signup():
    # get data from frontend
    username = request.json.get('username')
    password = request.json.get('password')
    nick_name = request.json.get('nick_name')
    email = request.json.get('email')
    avatar = 'http://192.168.1.6:19000/return_img/default_avatar.jpg'
    num_follower = 0
    num_following = 0
    pw = bcrypt.generate_password_hash(str(password))
    # get data from database.signup of mymodel.py
    values = (username,pw,nick_name, avatar,email, num_following, num_follower)
    new_account = database.signup(values)
    return jsonify({'new_account': new_account})

@app.route('/manager_signup', methods = ['POST'])
def managerSignup():
    # get data from frontend
    username = request.json.get('username')
    password = request.json.get('password')
    fullname = request.json.get('fullname')
    email = request.json.get('email')
    avatar = 'http://192.168.0.101:19000/return_img/default_avatar.jpg'
    pw = bcrypt.generate_password_hash(str(password))
    # get data from database.signup of mymodel.py
    values = (username,pw,fullname, avatar,email)
    new_account = database.signupManager(values)
    return jsonify({'new_account': new_account})

# get top of user
@app.route('/user/<int:page>', methods = ['GET'])
def getUser(page):
    result = User.query.paginate(page = page, per_page=1).items
    re = []
    for user in result:
        json_result = {'user_id': user.user_id,'username': user.username, 'fullname': user.fullname,
             'user_avatar': user.user_avatar, 'user_email': user.user_email,
             'num_following': user.num_following, 'num_follower': user.num_follower}
        re.append(json_result)
    return jsonify(re)

# get author of book or user information
@app.route('/author/<int:author_id>', methods = ['GET'])
def getAuthor(author_id):
    result = User.query.filter(User.user_id==author_id).all()
    re = []
    for user in result:
        json_result = {'user_id': user.user_id,'username': user.username, 'fullname': user.fullname,
             'user_avatar': user.user_avatar, 'user_email': user.user_email,
             'num_following': user.num_following, 'num_follower': user.num_follower}
        re.append(json_result)
    return jsonify(re)

@app.route('/famous', methods = ['GET'])
def getFamous():
    result = User.query.order_by(User.num_follower.desc()).limit(10)
    re = []
    for user in result:
        json_result = {'user_id': user.user_id,'username': user.username, 'fullname': user.fullname,
             'user_avatar': user.user_avatar,'user_email': user.user_email,
             'num_following': user.num_following, 'num_follower': user.num_follower}
        re.append(json_result)
    return jsonify(re)


# return img book 
@app.route('/return_img/<img>', methods = ['GET'])
def return_img(img):
    print(img)
    a = img.split('.')
    return send_from_directory(FILE_DIRECTORY,img,  as_attachment=True) 

# get list books
@app.route('/<int:page>',  methods=['GET', 'POST'])
def getBooks(page):
    try:
        result = Book.query.paginate(page = page, per_page=10).items
        re = []
        if len(result) != 0 or page != 0:
            for story in result:
                json_result = {'story_id': story.story_id,'story_title': story.story_title, 'author_id': story.author_id,
                    'story_description': story.story_description, 'story_img': story.story_img,
                    'category_id': story.category_id, 'vote': story.vote ,'parts': story.parts, 'story_status': story.story_status}
                re.append(json_result)
        else:
            result = {'Result':'wrong'}
            re.append(result)
    except:
        return jsonify([])
    return jsonify(re)

# get list books of author
@app.route('/book_author/<int:author_id>',  methods=['GET', 'POST'])
def getBookOfAuthor(author_id):
    result = Book.query.filter(Book.author_id==author_id).all()
    re = []
    for story in result:
        # link = 'http://192.168.1.6:19000/return_img/' + str(story.story_id)
        json_result = {'story_id': story.story_id,'story_title': story.story_title, 'author_id': story.author_id,
             'story_description': story.story_description, 'story_img': story.story_img,
             'category_id': story.category_id, 'vote': story.vote ,'parts': story.parts, 'story_status': story.story_status}
        re.append(json_result)
    return jsonify(re)

# get list catagoty
@app.route('/category', methods = ['GET'])
def getCategory():
    result = database.getCategory()
    return jsonify(result)

@app.route('/category/<int:category_id>', methods = ['GET'])
def getStoryCategory(category_id):
    result = database.getStoryCategory(category_id)
    return jsonify(result)

#get category story
@app.route('/category_story/<int:category>', methods = ['GET'])
def getCategoryStory(category):
    result = Book.query.filter(Book.category_id==category).all()
    re = []
    for story in result:
        json_result = {'story_id': story.story_id,'story_title': story.story_title, 'author_id': story.author_id,
             'story_description': story.story_description, 'story_img': story.story_img,
             'category_id': story.category_id, 'vote': story.vote ,'parts': story.parts, 'story_status': story.story_status}
        re.append(json_result)
    return jsonify(re)

# STORY
@app.route('/create_story', methods = ['POST']) 
def createStory():
    title_story = request.form['title_story']
    story_description = request.form['story_description']
    author_id = request.form['user_id']
    category_id = request.form['category_id']
    vote=0
    parts=0
    story_status= 'On Writing'

    rand_img_token = secrets.token_hex(8)
    story_img = request.files['file']
    story_img_link = ''
    story_img_name = title_story + rand_img_token + '.jpg'
    print(story_img)
    if story_img is None:
        story_img_link = 'http://192.168.0.101:19000/return_img/default-image.jpg'
    else:
        story_img.save(os.path.join(app.config['UPLOAD_FOLDER'], story_img_name))
        story_img_link = 'http://192.168.0.101:19000/return_img/' + story_img_name

    values = (title_story, author_id, story_description, story_img_link, category_id, vote, parts, story_status)
    result = database.createStory(values)
    return jsonify({'result': result})

@app.route('/edit_story', methods = ['POST']) 
def edit_story():
    story_id = request.form['story_id']
    title_story = request.form['title_story']
    story_description = request.form['story_description']
    category_id = request.form['category_id']

    rand_img_token = secrets.token_hex(8)
    story_img = request.files['file']
    story_img_link = ''
    story_img_name = title_story + rand_img_token + '.jpg'
    print(story_img)
    if story_img is None:
        story_img_link = 'http://192.168.0.101:19000/return_img/default-image.jpg'
    else:
        story_img.save(os.path.join(app.config['UPLOAD_FOLDER'], story_img_name))
        story_img_link = 'http://192.168.0.101:19000/return_img/' + story_img_name
    
    values = (story_id, title_story, story_description, story_img_link, category_id)
    result = database.editStory(values)
    return jsonify({'result': result})

@app.route('/delete_story/<int:story_id>', methods = ['GET']) 
def deleteStory(story_id):
    result = database.delete_story(story_id)
    return jsonify({'row-affect': result})

@app.route('/get_story/<int:story_id>', methods = ['GET']) 
def getStory(story_id):
    result = database.getStory(story_id)
    return jsonify(result)

# FOLLOW
@app.route('/get_following/<int:following_id>', methods = ['GET']) 
def getFollowing(following_id):
    result = database.getFollowing(following_id)
    return jsonify(result)

@app.route('/follow', methods = ['POST']) 
def follow():
    following_id = request.json.get('following_id')
    follower_id =  request.json.get('follower_id')
    num_follower = request.json.get('num_follower')
    num_following = request.json.get('num_following')
    values = (following_id, follower_id, num_follower, num_following)
    result = database.follow(values)
    return jsonify({'row-affect': result})

@app.route('/get_follow/<int:following_id>/<int:follower_id>', methods = ['GET']) 
def getFollow(following_id,follower_id):
    result = database.getFollow(following_id,follower_id)
    return jsonify(result)

@app.route('/unfollow', methods = ['POST']) 
def unfollow():
    following_id = request.json.get('following_id')
    follower_id =  request.json.get('follower_id')
    num_follower = request.json.get('num_follower')
    num_following = request.json.get('num_following')
    values = (following_id, follower_id, num_follower, num_following)
    result = database.unfollow(values)
    return jsonify({'row-affect': result})

# Notification 
@app.route('/notification/<int:user_id>', methods = ['GET'])
def getNotification(user_id):
    result = database.getNotification(user_id)
    return jsonify(result)

@app.route('/newNotification', methods = ['POST']) 
def newNotification():
    user_id = request.json.get('user_id')
    notification_content = request.json.get('content')
    values = (user_id, notification_content)
    result = database.newNotification(values)
    return jsonify({'result': result})

# CHAPTER
@app.route('/chapter/<int:story_id>', methods = ['GET'])
def getChapter(story_id):
    result = database.getChapter(story_id)
    return jsonify(result)

@app.route('/chapter/<int:story_id>/<int:chapter_id>', methods = ['GET'])
def getChapterContent(story_id, chapter_id):
    result = database.getChapterContent(story_id,chapter_id)
    return jsonify(result)

@app.route('/next_chapter/<int:story_id>/<int:chapter_id>', methods = ['GET'])
def getNextChapterContent(story_id, chapter_id):
    chapter = database.getNextChapterContent(story_id,chapter_id)
    return jsonify(chapter)

@app.route('/prev_chapter/<int:story_id>/<int:chapter_id>', methods = ['GET'])
def getPrevChapterContent(story_id, chapter_id):
    chapter = database.getPrevChapterContent(story_id,chapter_id)
    return jsonify(chapter)

@app.route('/default_chapter/<int:story_id>', methods = ['GET'])
def getDefaultChapterContent(story_id):
    chapter = database.getDefaultChapterContent(story_id)
    return jsonify(chapter)


@app.route('/vote/<int:story_id>/<int:vote>', methods = ['GET'])
def updateVote(story_id, vote):
    vote = database.updateVote(story_id, vote)
    return jsonify({'row_affected': vote})

@app.route('/upload_chapter', methods = ['POST']) 
def uploadChapter():
    story_id = request.json.get('story_id')
    chapter_name = request.json.get('chapter_name')
    chapter_content = request.json.get('chapter_content')
    story_status = request.json.get('story_status')
    parts = request.json.get('parts')
    values = (story_id, chapter_name, chapter_content, story_status, parts)
    result = database.uploadChapter(values)
    return jsonify({'result': result})

@app.route('/edit_chapter', methods = ['POST']) 
def edit_chapter():
    story_id = request.json.get('story_id')
    chapter_name = request.json.get('chapter_name')
    chapter_content = request.json.get('chapter_content')
    story_status = request.json.get('story_status')
    values = (story_id, chapter_name, chapter_content, story_status)
    result = database.edit_chapter(values)
    return jsonify({'result': result})

@app.route('/delete_chapter/<int:story_id>/<int:chapter_id>', methods = ['GET']) 
def deleteChapter(story_id, chapter_id):
    result = database.deleteChapter(story_id, chapter_id)
    return jsonify({'row-affect': result})

# @app.upload_img('upload_img', methods = ['POST'])
# def upload_img():
#     img = request.json.get('img')
#     return send_from_directory(FILE_DIRECTORY,img)

# SEARCH
@app.route('/search_user/<string:search>', methods = ['GET']) 
def getSearchUser(search):
    result = database.getSearchUser(search)
    return jsonify(result)

@app.route('/search_story/<string:search>', methods = ['GET']) 
def getSearchStory(search):
    result = database.getSearchStory(search)
    return jsonify(result)

@app.route('/search_story_list/<string:search>', methods = ['GET']) 
def getSearchStoryList(search):
    result = database.getSearchStoryList(search)
    return jsonify(result)

# LIST
@app.route('/get_list/<int:user_id>', methods = ['GET']) 
def getList(user_id):
    result = database.getList(user_id)
    return jsonify(result)

@app.route('/create_list', methods = ['POST']) 
def createList():
    user_id = request.json.get('user_id')
    list_name = request.json.get('list_name')
    result = database.createList(user_id, list_name)
    return jsonify({'row-affect': result})

@app.route('/add_to_list/<int:list_id>/<int:story_id>', methods = ['GET']) 
def addStory(list_id, story_id):
    result = database.addStory(list_id, story_id)
    return jsonify({'row-efect': result})

@app.route('/get_story_list/<int:list_id>', methods = ['GET']) 
def getStoryList(list_id):
    result = database.getStoryList(list_id)
    return jsonify(result)

@app.route('/delete_list/<int:user_id>/<int:list_id>', methods = ['GET']) 
def deleteList(user_id, list_id):
    result = database.deleteList(user_id, list_id)
    return jsonify({'row-affect': result})

@app.route('/remove_story_list/<int:list_id>/<int:story_id>', methods = ['GET']) 
def removeStoryList(list_id, story_id):
    result = database.removeStoryList(list_id, story_id)
    return jsonify({'row-affect': result})

@app.route('/get_contact/<int:user_id>', methods = ['GET']) 
def getContact(user_id):
    result = database.getContact(user_id)
    return jsonify( result)

# CHANGE PROFILE

@app.route('/change_password', methods = ['POST']) 
def change_password():
    user_id = request.json.get('user_id')
    password = request.json.get('password')
    pw = bcrypt.generate_password_hash(str(password))
    result = database.change_password(user_id, pw)
    return jsonify({'row-affect': result})

@app.route('/check_password', methods = ['POST']) 
def check_password():
    user_id = request.json.get('user_id')
    password = str(request.json.get('password'))
    account = database.check_password(user_id)
    db_password = account['user_pw']
    if bcrypt.check_password_hash(db_password, password):
        return jsonify({'password': 'true'})
    else: 
        return jsonify({'password': 'false'})

@app.route('/profile_change', methods = ['POST']) 
def profile_change():
    fullname = request.form['fullname']
    username = request.form['username']
    user_id = request.form['user_id']
    email = request.form['email']

    rand_img_token = secrets.token_hex(8)
    avatar = request.files['file']
    avatar_link = ''
    avatar_name = username + rand_img_token + '.jpg'
    print(avatar)
    if avatar is None:
        avatar_link = 'http://192.168.0.101:19000/return_img/default-avatar.jpg'
    else:
        avatar.save(os.path.join(app.config['UPLOAD_FOLDER'], avatar_name))
        avatar_link = 'http://192.168.0.101:19000/return_img/' + avatar_name

    values = (username, fullname, avatar_link, email, user_id)
    result = database.change_profile(values)
    return jsonify({'result': result})

#emit comment (gửi để hiện thị lên màn hình người luôn)
@app.route('/add_comment', methods = ['POST']) 
def add_comment():
    comment_content = request.json.get('comment_content')
    user_id = request.json.get('user_id')
    story_id = request.json.get('story_id')
    comment = (comment_content,user_id,story_id)
    result=database.add_comment(comment)
    return jsonify({'row-affect': result})

@app.route('/get_comment/<int:story_id>', methods = ['GET']) 
def get_comment(story_id):
    result = database.get_comment(story_id)
    return jsonify(result)

# REPORT
@app.route('/get_report', methods = ['GET']) 
def get_report():
    result = database.get_report()
    return jsonify(result)

@app.route('/report_story', methods = ['POST']) 
def report_story():
    report_title = request.json.get('report_title')
    report_content = request.json.get('report_content')
    story_id = request.json.get('story_id')
    reporter = request.json.get('reporter')
    status = 'Wait'
    values = (report_title,report_content,story_id,reporter, status)
    result = database.report_story(values)
    return jsonify({'row-affect': result})

@app.route('/pass_report', methods = ['POST']) 
def pass_report():
    status = request.json.get('status')
    report_id = request.json.get('report_id')
    values = (status, report_id)
    result = database.pass_report(values)
    return jsonify({'row-affect': result})

@app.route('/delete_report/<int:report_id>', methods = ['GET']) 
def delete_report(report_id):
    result = database.delete_report(report_id)
    return jsonify(result)

#send email to warning

@app.route('/warning_email',methods=['POST'])
def send_warning():
    gmail = request.json.get('user_email')
    story_id = request.json.get('story_id')
    story_title = request.json.get('story_title')
    warning_times = request.json.get('warning_times')
    status = request.json.get('status')
    report_id = request.json.get('report_id')
    values = (story_id, warning_times, status, report_id)
    result = database.warning(values)
    msg1 = Message( 
        'WARNING!! violating the rules when posting stories', 
        body='Your '+ story_title +' storyline violated the rules for posting a story of QQBimApp.\
            You have been submitted by a user to a report. So you need to fix them.\
            If you violate more than three times, your story will be permanently removed from QQBimApp.',
        sender='QQBimApp', 
        recipients=[gmail,]
    )
    mail.send(msg1)
    return jsonify('done')

@app.route('/get_warning/<int:story_id>',methods=['GET'])
def get_warning(story_id):
    result = database.get_warning(story_id)
    return jsonify(result)

@app.route('/delete_account',methods=['POST'])
def delete_account():
    gmail = request.json.get('user_email')
    user_id = request.json.get('user_id')
    result = database.delete_account(user_id)
    msg1 = Message( 
        'Delete your QQBimApp account.', 
        body='You violated the rules for posting a story of QQBimApp so many time. So we decided that your account will be deleted forever.',
        sender='QQBimApp', 
        recipients=[gmail,]
    )
    mail.send(msg1)
    return jsonify('done')

@app.route('/delete_story',methods=['POST'])
def delete_story():
    gmail = request.json.get('user_email')
    story_id = request.json.get('story_id')
    story_title = request.json.get('story_title')
    result = database.delete_story(story_id)
    msg1 = Message( 
        'Delete your story on QQBimApp account.', 
        body='Your '+ story_title +' storyline violated the rules for posting a story of QQBimApp.\
            Your story violated more than three times, your story will be permanently removed from QQBimApp.',
        sender='QQBimApp', 
        recipients=[gmail,]
    )
    mail.send(msg1)
    return jsonify('done')

# CHATTING
@app.route('/get_chat_list/<int:user_id>',methods=['GET'])
def get_chat_list(user_id):
    result = database.get_chatlist(user_id)
    return jsonify(result)

@app.route('/get_messages/<int:own_id>/<int:user_id>',methods=['GET'])
def get_messages(own_id,user_id):
    result = database.get_messages(own_id,user_id)
    return jsonify(result)

@app.route('/send_message',methods=['POST'])
def send_message():
    sender_id = request.json.get('sender_id')
    messages_content = request.json.get('messages_content')
    receiver_id = request.json.get('receiver_id')
    values = (receiver_id, sender_id, messages_content)
    result = database.send_message(values)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=19000)
    #app.run(port=5000)
    #app.run(debug=True,host="0.0.0.0",port=5000)
    #app.run(host="192.168.179.2", port=5000)