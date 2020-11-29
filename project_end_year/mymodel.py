import mysql.connector
def conn1():
    return mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = 'bim1',
        database = 'db_qqbimapp'
    )
    # dictionary = true: to display name of atribute
    # conn  để kết nối đên db
    # cursor để chạy câu lệnh

from flask_paginate import Pagination
def close_connection(conn, cursor):
    conn.close()
    cursor.close()

class database:
    #login for user
    def login(self, username):
        try:
            query1 = 'select * from tbluser where username = %s'
            query2 = 'select * from tblmanager where username = %s'

            conn = conn1()
            cursor = conn.cursor(buffered = True , dictionary = True)
            cursor.execute(query1,username)
            result1 = cursor.fetchone()
            if result1:
               result1.update({'role':'user'})
               return result1
            cursor.execute(query2,username)
            result2 = cursor.fetchone()
            if result2:
               result2.update({'role':'manager'})
               return result2
            close_connection(conn, cursor)
            return None
        except:
            raise Exception
            return 'wrong'
    def signupManager(self, values):
        try:
            query = 'insert into \
                        tblmanager(username, user_pw, fullname, user_avatar ,user_email) \
                            values(%s,%s,%s,%s,%s)'
            conn = conn1()
            cursor = conn.cursor(buffered = True , dictionary = True)
            cursor.execute(query,values)
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    # reset password
    def code_password(self, username, code):
        try:
            query = 'select * from tbluser where username = %s'
            query1 = 'INSERT INTO tblcode( username, current_code )VALUES (%s, %s) ON DUPLICATE KEY UPDATE username = %s, current_code = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(username,))
            result1 = cursor.fetchone()
            if result1 is None:
                return 0
            else:
                cursor.execute(query1,(username, code,username, code,))
                conn.commit()
                row_affected = cursor.rowcount  
            close_connection(conn, cursor)
            return result1
        except:
            raise Exception
            return 'wrong'

    def check_code(self, code):
        try:
            query = 'select * from tblcode where current_code = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(code,))
            result1 = cursor.fetchone()
            close_connection(conn, cursor)
            return result1
        except:
            raise Exception
            return 'wrong'

    def reset_password(self, values):
        try:
            query = "update tbluser set user_pw = %s where username = %s"
            query2 = "delete from tblcode where current_code = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(values[1],values[0], ))
            cursor.execute(query2,(values[2], ))
            conn.commit()
            row_affected = cursor.rowcount   
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'Wrong'
    
    # create account for user
    def signup(self, values):
        try:
            query = 'insert into \
                        tbluser(username, user_pw, fullname, user_avatar ,user_email, num_following, num_follower) \
                            values(%s,%s,%s,%s,%s,%s,%s)'
            query1 = 'select * from tbluser where username = %s'
            query2 = 'select * from tbluser where user_email = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query1, (values[0],))
            result1 = cursor.fetchall()
            cursor.execute(query2, (values[4],))
            result2 = cursor.fetchall()
            if result1:
                return 0
            elif result2:
                return 0
            else:
                cursor.execute(query,values)
                conn.commit()
                row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'
    
    # get catagory
    def getCategory(self):
        try:
            query = 'select * from tblcategory'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query)
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getStoryCategory(self, category_id):
        try:
            query = 'select * from tblcategory where category_id=%s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (category_id,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'
    
    # create story
    def createStory(self, values):
        try:
            query = 'insert into \
                        tblstory(story_title, author_id, story_description, story_img, category_id, vote, parts, story_status)\
                            values(%s, %s, %s, %s, %s, %s, %s, %s)'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, values)
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def editStory(self, values):
        try:
            query = 'update \
                        tblstory set story_title = %s, story_description = %s, \
                        story_img = %s, category_id = %s where story_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (values[1],values[2], values[3],values[4],values[0],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'
    
    def getStory(self, story_id):
        try:
            query = 'select * from tblstory where story_id =%s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (story_id,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    #FOLLOW
    def getFollowing(self, get_following):
        try:
            query = 'select * from tblfollowing right join tbluser on tblfollowing.follower_id= tbluser.user_id where tblfollowing.following_id=%s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (get_following,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def follow(self, values):
        try:
            query = 'insert into tblfollowing(following_id, follower_id) values(%s, %s)'
            query1 = 'UPDATE tbluser SET  num_following = %s WHERE user_id = %s;'
            query2 = 'UPDATE tbluser SET  num_follower = %s WHERE user_id = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,(values[0],values[1],))
            cursor.execute(query1,(values[3],values[0],))
            cursor.execute(query2,(values[2],values[1],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def getFollow(self,following_id, follower_id):
        try:
            query = 'select * from tblfollowing where following_id = %s and follower_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,(following_id, follower_id,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def unfollow(self, values):
        try:
            query = 'delete from tblfollowing where following_id = %s and follower_id = %s'
            query1 = 'UPDATE tbluser SET  num_following = %s WHERE user_id = %s;'
            query2 = 'UPDATE tbluser SET  num_follower = %s WHERE user_id = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,(values[0],values[1],))
            cursor.execute(query1,(values[3],values[0],))
            cursor.execute(query2,(values[2],values[1],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    # Notification
    def getNotification(self, user_id):
        try:
            query = 'select * from tblfollowing right join tblnotification on tblfollowing.follower_id = tblnotification.user_id right join tbluser on tblfollowing.follower_id = tbluser.user_id where tblfollowing.following_id=%s order by tblnotification.notification_id'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (user_id,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def newNotification(self, values):
        try:
            query = 'insert into tblnotification(user_id, notification_content) values(%s, %s)'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,values)
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'
    # ChAPTER
    def uploadChapter(self, values):
        try:
            query = 'insert into tblchapter(story_id, chapter_name, chapter_content) values(%s, %s, %s)'
            query2 = 'UPDATE tblstory SET  story_status = %s, parts = %s WHERE story_id = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,(values[0], values[1], values[2],))
            cursor.execute(query2,(values[3], values[4], values[0],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def edit_chapter(self, values):
        try:
            query = 'update tblchapter set chapter_name = %s, chapter_content = %s where story_id = %s'
            query2 = 'UPDATE tblstory SET  story_status = %s WHERE story_id = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query,(values[1], values[2], values[0],))
            cursor.execute(query2,(values[3], values[0],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def deleteChapter(self, story_id, chapter_id):
        try:
            query = 'delete from tblchapter where story_id = %s and chapter_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (story_id,chapter_id,))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def getChapter(self, story_id):
        try:
            query = "select * from tblchapter where story_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (story_id,))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getChapterContent(self, story_id ,chapter_id):
        try:
            query = "select * from tblchapter where story_id = %s and chapter_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(story_id, chapter_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getNextChapterContent(self, story_id ,chapter_id):
        try:
            query = "select * from tblchapter where story_id = %s and chapter_id > %s order by story_id limit 1"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(story_id, chapter_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getPrevChapterContent(self, story_id ,chapter_id):
        try:
            query = "select * from tblchapter where story_id = %s and chapter_id < %s order by story_id desc limit 1"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(story_id, chapter_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getDefaultChapterContent(self, story_id ):
        try:
            query = "select * from tblchapter where story_id = %s order by story_id desc limit 1"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(story_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def updateVote(self, story_id, vote):
        try:
            query = 'UPDATE tblstory SET vote = %s where story_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(vote, story_id,))
            conn.commit()
            row_affected = cursor.rowcount  
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'
    # SEARCH
    def getSearchUser(self, search):
        try:
            query1 = "select * from tbluser where username like %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query1,('%'+search+ '%',))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getSearchStory(self, search):
        try:
            query1 = "select * from tblstory where story_title like %s "
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query1,('%'+search+ '%',))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def getSearchStoryList(self, search):
        try:
            query1 = "select * from tblliststory where list_name like %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query1,('%'+search+ '%',))
            result = cursor.fetchall()
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    #LIST
    def getList(self, user_id):
        try:
            query = "select * from tblliststory where user_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(user_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def createList(self, user_id, list_name):
        try:
            query = 'insert into tblliststory(user_id, list_name) values(%s, %s)'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(user_id, list_name,))
            conn.commit()
            row_affected = cursor.rowcount  
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def addStory(self, list_id, story_id):
        try:
            query = 'insert into tbldetaillist(list_id, story_id) values(%s, %s)'
            query1 = 'select * from tbldetaillist where list_id = %s and story_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query1,(list_id, story_id,))
            result1 = cursor.fetchall()
            if result1:
                return 0,
            else:
                cursor.execute(query,(list_id, story_id,))
                conn.commit()
                row_affected = cursor.rowcount  
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def getStoryList(self, list_id):
        try:
            query = "select * from tbldetaillist right join tblstory on tbldetaillist.story_id= tblstory.story_id where tbldetaillist.list_id=%s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(list_id,))
            result = cursor.fetchall()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def deleteList(self, user_id, list_id):
        try:
            query = 'delete from tbldetailList where list_id = %s'
            query1 = 'delete from tblliststory where list_id = %s and user_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (list_id,))
            cursor.execute(query1, (list_id, user_id,))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def removeStoryList(self, list_id, story_id):
        try:
            query = 'DELETE FROM tbldetaillist WHERE (list_id = %s) and (story_id = %s)'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query, (list_id,story_id,))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    # CHANGE PROFILE
    def change_password(self, user_id, password):
        try:
            query = "update tbluser set user_pw = %s where user_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(password,user_id, ))
            conn.commit()
            row_affected = cursor.rowcount   
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'Wrong'

    def check_password(self, user_id):
        try:
            query = "select * from tbluser where user_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            cursor.execute(query,(user_id,))
            result = cursor.fetchone()   
            close_connection(conn, cursor)
            return result
        except:
            raise Exception
            return 'Wrong'

    def change_profile(self, values):
        try:
            query = "update tbluser set username = %s, fullname = %s, user_avatar = %s, user_email = %s where user_id = %s"
            query2 = "update tbluser set username = %s, fullname = %s, user_email = %s where user_id = %s"
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary=True)
            if values[2] is None:
                cursor.execute(query2,(values[0], values[1], values[3], values[4],))
            else:
                cursor.execute(query,(values))
            conn.commit()
            row_affected = cursor.rowcount  
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'Wrong'

        # get comment
    def get_comment(self,story_id):
        try:
            query = "select * from tblcomment right join tbluser on tblcomment.user_id= tbluser.user_id where tblcomment.story_id =%s order by tblcomment.comment_id"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(story_id,))
            result = cursor.fetchall()
            cursor.close()
            con.close()
            return result
        except:
            return 'wrong'
    
    #  add comment
    def add_comment(self,comment):
        try:
            query = "insert into tblcomment(comment_content,user_id,story_id) values(%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,comment)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

# REPORTE
    def get_report(self):
        try:
            query = "select * from tblreport left join tblstory on tblreport.story_id = tblstory.story_id\
                left join tbluser on tblstory.author_id = tbluser.user_id"
            con = conn1() 
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

    def get_warning(self, story_id):
        try:
            query = "select warning_times from tblwarning where story_report_id = %s"
            con = conn1() 
            cursor =  con.cursor(buffered=True , dictionary=False)
            cursor.execute(query, (story_id,))
            result = cursor.fetchone()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'
    
    def report_story(self, values):
        try:
            query = "insert into tblreport(report_title,report_content,story_id,reporter, report_status) values(%s,%s,%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,values)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

    def delete_report(self, report_id):
        try:
            query = "DELETE FROM tblreport WHERE report_id = %s;"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query, (report_id,))
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

    def delete_story(self, story_id):
        try:
            query = 'DELETE FROM tblstory WHERE story_id = %s'
            query1 = 'DELETE FROM tbldetaillist WHERE story_id = %s'
            query2 = 'DELETE FROM tblchapter WHERE story_id = %s'
            query3 = 'DELETE FROM tblcomment WHERE story_id = %s'
            query4 = 'DELETE FROM tblreport WHERE story_id = %s'
            query5 = 'DELETE FROM tblwarning WHERE story_report_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query1, (story_id,))
            cursor.execute(query2, (story_id,))
            cursor.execute(query3, (story_id,))
            cursor.execute(query4, (story_id,))
            cursor.execute(query5, (story_id,))
            cursor.execute(query, (story_id,))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def delete_account(self, user_id):
        try:
            query = 'DELETE FROM tbluser WHERE user_id = %s'
            query1 = 'DELETE FROM tblfollowing WHERE follower_id = %s'
            query2 = 'DELETE FROM tblfollowing WHERE following_id = %s'
            query3 = 'DELETE FROM tblmessage WHERE sender_id = %s'
            query4 = 'DELETE FROM tblnotification WHERE user_id = %s'
            query5 = 'DELETE FROM tblreport WHERE reporter = %s'
            query6 = 'DELETE FROM tblcomment WHERE user_id = %s'
            query8 = 'DELETE  from tblmessage where receiver_id = %s'
            query9 = 'DELETE  from tbldetaillist where story_id in ( select story_id from tblstory WHERE author_id = %s)'
            query10 = 'DELETE from tblchapter where story_id in ( select story_id from tblstory WHERE author_id = %s)'
            query11 = 'DELETE from tblcomment where story_id in ( select story_id from tblstory WHERE author_id = %s)'
            query12 = 'DELETE from tblreport where story_id in ( select story_id from tblstory WHERE author_id = %s)'
            query13 = 'DELETE from tblwarning where story_report_id in ( select story_id from tblstory WHERE author_id = %s)'
            query14 = 'DELETE FROM tblstory WHERE author_id = %s'
            query15 = 'DELETE FROM tblliststory WHERE user_id = %s'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query1, (user_id,))
            cursor.execute(query2, (user_id,))
            cursor.execute(query3, (user_id,))
            cursor.execute(query4, (user_id,))
            cursor.execute(query5, (user_id,))
            cursor.execute(query6, (user_id,))
            cursor.execute(query8, (user_id,))
            cursor.execute(query9, (user_id,))
            cursor.execute(query10, (user_id,))
            cursor.execute(query11, (user_id,))
            cursor.execute(query12, (user_id,))
            cursor.execute(query13, (user_id,))
            cursor.execute(query14, (user_id, ))
            cursor.execute(query15, (user_id,))
            cursor.execute(query, (user_id,))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def warning(self, values):
        try:
            query = 'insert into tblwarning(story_report_id,warning_times) values (%s, 1)'
            query1 = 'select * from tblwarning where story_report_id = %s'
            query2 = 'update tblwarning set warning_times = %s'
            query3 = 'update tblreport set report_status = %s where report_id = %s;'
            conn = conn1()
            cursor = conn.cursor(buffered = True, dictionary = True)
            cursor.execute(query3, (values[2],values[3],))
            cursor.execute(query1, (values[0],))
            result = cursor.fetchone()
            if result is None:
                cursor.execute(query, (values[0],))
            else:
                cursor.execute(query2, (values[1],))
            conn.commit()
            row_affected = cursor.rowcount
            close_connection(conn, cursor)
            return row_affected
        except:
            raise Exception
            return 'wrong'

    def pass_report(self, values):
        try:
            query = "update tblreport set report_status = %s where report_id = %s;"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,values)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'

# chatting
    # get chat list
    def get_chatlist(self,user_id):
        try:
            query = "select * from (select sender_id as a from tblmessage where receiver_id = %s union  select receiver_id as a from tblmessage where sender_id = %s) as b left join tbluser on b.a = tbluser.user_id;"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(user_id,user_id,))
            result = cursor.fetchall()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'
    # get message
    def get_messages(self,id1, id2):
        try:
            query = "select * from tblmessage left join tbluser on %s = tbluser.user_id where (sender_id = %s and receiver_id = %s) or (receiver_id = %s and sender_id = %s) order by tblmessage.message_id;"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,(id2, id1, id2,id1, id2))
            result = cursor.fetchall()
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'
    
    # add message
    def send_message(self, message):
        try:
            query = "insert into tblmessage(receiver_id, sender_id, massage_content) values(%s,%s,%s);"
            con = conn1()
            cursor =  con.cursor(buffered=True , dictionary=True)
            cursor.execute(query,message)
            con.commit()
            result = cursor.rowcount
            cursor.close()
            con.close()
            return result
        except:
            raise Exception
            return 'wrong'