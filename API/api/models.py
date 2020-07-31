from django.db import models
import json

# Create your models here.

class component(models.Model):
    models.fields = ('comp_id', 'comp_info')
    comp_id = models.IntegerField('comp_id', primary_key=True)
    comp_info = models.CharField('comp_info', max_length=1000)
    comp_desc = models.CharField('comp_desc',max_length=1000)
    comp_price = models.CharField('comp_price',max_length=11)
    comp_type = models.IntegerField('comp_type')

    def __str__(self):
        return json.loads(self.comp_info)['title']
    def getDesc(self):
        return self.comp_desc
    def getLink(self):
        return json.loads(self.comp_info)['link']
    def getImageLink(self):
        return json.loads(self.comp_info)['img']
    def getPrice(self):
        return self.comp_price.replace('\xa0','')
    def getType(self):
        return self.comp_type
    def returnList(self):
        return {
            "id": self.comp_id,
            "title": json.loads(self.comp_info)['title'],
            "desc": self.comp_desc,
            "link": json.loads(self.comp_info)['link'],
            "img": json.loads(self.comp_info)['img'],
            "price": self.comp_price.replace('\xa0',''),
            "type": self.comp_type
        }

class user(models.Model):
    models.fields = ('user_id')
    user_id = models.IntegerField('user_id', primary_key=True)
    user_name = models.CharField('user_name', max_length=1000)
    user_password = models.CharField('user_password',max_length=1000)
    user_role = models.CharField('user_role',max_length=11)

    def __str__(self):
        return self.user_name