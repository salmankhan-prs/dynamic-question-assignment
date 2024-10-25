# Dynamic Question Assignment 🎯

⚠️ **Disclaimer:** Here to make things a little easier, I've not followed production-level implementation practices, so this is a rough implementation:

* For example, I want to run cron jobs, I would use AWS Scheduler which will run in different machines instead of using them in the main server
* For migrations, I have written scripts to load the sample data, but in production level we should use migrate-mongo or something similar which will help maintain integrity of migrations in all the environments and so on... 🚀

## Assumptions and Description ✨
So the main focus here is how we will assign questions dynamically for each region, so I mostly focused on that.

### Question Schema 📝
Firstly, I have created two schemas for questions. So each question will have a region. Here for region, I am using enum array [HERE we need a compound multi-key index] to make faster queries.

And for questionId, we should make a sequence counter. Here we should maintain sequence counter for each region [we can keep index questionId+region should be always unique].

💡 Note: Here I kept only text in the question to make it easy, but it should be MCQ in real implementation.

### Cyclic Collection 🔄
Here I added:
* region 
* questionId 
* currentCycleStart

Here the assumption is that I have decided to keep at a time we should have one document for one region. That means I'm not keeping history [as I have not found any use case that requires the history]. By this, we keep the active question for one region and we update this. This will keep index size less and queries will be faster.

### Creating Counter Mechanism 🔢
To keep track of questionId sequence for each region:
* For each region we should keep separate sequence counter as we need to use this to assign questions in sequence order for each region
* So in MongoDB I have created separate collection 'counter' to keep track of what is last question ID for each region [created index where region should be unique]
* To optimize more, tracking this using Redis as it will be faster and periodically updating to MongoDB

### Crons ⏰
1. Question Assignment and Rotation
   * Here we will run cron as per specified time
   * Since we are deciding handling the questions as sequence, the question rotation is easy
   * So for every region we rotate/update the cyclic to next question [by +1]
   * If the question is not there we can stop the rotation for the next question [alternatively we can rotate to first question]

2. Update Sequence Counter from Redis to MongoDB
   * Here for every specified time [like 10 minutes] we update the sequence counter to MongoDB

### APIs 🌐
1. Create questions
```
POST http://localhost:3000/questions
{
  "text": "hello",
  "region": "SG"
}
```
Here we will use the sequence counter as explained above to get the question ID.

2. Get question by id and region
3. Get current question for the given region `/cyclic`

### Pros ✅
The pros of this implementation is basically it's easy and built in less time and it will be scaled as per the given requirement 

### Cons ⚠️
* Again there is room for lot of improvements
* We can handle the sequence counter in optimized way [like if we have bulk questions, we can update counter in Redis in batch instead of updating every time]

### Run Locally 🚀
do git clone ,npm install and npm start

### Demo Video 🎥
Check out the working demonstration of the  crons here:
[Watch the demo](https://www.loom.com/share/fd91f98683164ce9aef782b9fbaac43a)

[🙈 Sorry for the audio quality - my laptop's microphone is trying its best! 😅]